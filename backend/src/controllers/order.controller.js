import mongoose from "mongoose";
import Order from "../models/order.model.js";
import OrderItem from "../models/orderItem.model.js";
import formatDate from "../utils/formatDate.js";
import validateItems from "../utils/validateItems.js";
import updateExportQuantity from "../utils/updateExportQuantity.js";
import {getTotalAmount, getTotalItem} from "../utils/getTotal.js";
import updateProductStock from "../utils/updateProductStock.js";
import { Types } from "mongoose";
import checkProductStock from "../utils/checkProductStock.js";

const getOrders = async (req, res) => {
    let orders;
    try {
        orders = await Order.find().limit(100).sort({createdAt: -1, orderDate: -1});
    } catch (error) {
        console.log(`Error in getOrders controller: ${error.message}`);
        return res.status(500).json({ message: 'Lỗi máy chủ. Hãy thử lại sau.' });

    }
    if (!orders || orders.length === 0){
        return res.status(404).json({ message: "No orders found." });
    }
    res.status(200).json(orders.map(order => order.toObject({getters: true})));
};

const searchOrders = async (req,res) => {
    let existingOrders = [];
    try {
        existingOrders = await getOrdersBySearch(req.query.searchTerm);
    } catch (error) {
        console.log(`Error in searchOrders controller: ${error.message}`);
        return res.status(500).json({ message: 'Lỗi máy chủ. Hãy thử lại sau.' });
    }

    return res.status(200).json(existingOrders.length > 0 ? existingOrders.map(order => order.toObject({getters: true})) : []);
};

const getOrdersBySearch = async (searchTerm) => {
    // console.log(searchTerm);
    let existingItems;
    let existingOrders = [];
    try {
        existingItems = await OrderItem.find().populate('product');
        existingItems = existingItems.filter(item => {
            const productName = item.product.name;
            return productName.toLowerCase().includes(searchTerm.toLowerCase());
        });
        // console.log(existingItems);
        const itemOrderIds = existingItems.map(item => item.order);
        // console.log(itemOrderIds);
        existingOrders = await Order.find({
            $or: [
                {customerName: new RegExp(searchTerm, "i")}, 
                {_id: {$in: itemOrderIds}}
            ]
        }).sort({createdAt: -1, orderDate: -1});
        // console.log(resultOrders);
    } catch (error) {
        console.log(`Error in getOrdersBySearch controller: ${error.message}`);
        return error;
    }
    return existingOrders;
};

const getOrdersByFilter = async (req,res) => {
    const {filterData} = req.body;
    const {minItemQuantity, maxItemQuantity, minTotalAmount, maxTotalAmount, startDate, endDate} = filterData;
    console.log(filterData);

    

    // Convert startDate to beginning of the day
    const startOfDay = startDate? new Date(startDate): new Date('1970-01-01');
    startOfDay.setHours(0, 0, 0, 0);

    // Convert endDate to end of the day (23:59:59.999)
    const endOfDay = endDate? new Date(endDate): new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const matchConditions = {
        createdAt: {
            $gte: startOfDay,
            $lte: endOfDay
        }
    }

    if (minItemQuantity === ""){
        matchConditions.itemQuantity = {...matchConditions.itemQuantity, $gte: 0};
    }

    if (maxItemQuantity === "" || maxItemQuantity === 0){
        matchConditions.itemQuantity = {...matchConditions.itemQuantity, $lte: Number.MAX_SAFE_INTEGER };
    }

    if (minTotalAmount === ""){
        matchConditions.totalAmount = {...matchConditions.itemQuantity, $gte: 0 };
    }

    if (maxTotalAmount === "" || maxItemQuantity === 0){
        matchConditions.totalAmount = {...matchConditions.totalAmount, $lte: Number.MAX_SAFE_INTEGER };
    }

    let filteredOrders;
    try {
        filteredOrders = await Order.aggregate([
            {$match: matchConditions},
            { $sort: {createdAt: -1}}
        ]);
    } catch (error) {
        console.log(`Error in getOrdersByFilter controller: ${error.message}`);
        return res.status(500).json({ message: 'Lỗi máy chủ. Hãy thử lại sau.' });
    }

    if (!filteredOrders || filteredOrders.length <=0){
        return res.status(404).json({ message: 'Không có đơn hàng nào thỏa mãn.' });
    }

    return res.status(200).json(filteredOrders.map(order => ({
        ...order,
        id: order._id.toString()
    })));
    
};

const getOrderById = async (req, res) => {
    const orderId = req.params.id;
    // console.log(orderId);
    let existingOrder;
    let existingOrderItems;
    try {
        existingOrder = await Order.findById(orderId);
        if (!existingOrder){
            return res.status(404).json({ message: 'Order not found.' });
        }

        existingOrderItems = await OrderItem.find({order: existingOrder._id}).populate('product');
        if (!existingOrderItems || existingOrderItems.length === 0){
            return res.status(404).json({ message: 'No order items found for this order.' });
        }
    } catch (error) {
        console.log(`Error in getOrderById controller: ${error.message}`);
        return res.status(500).json({ message: 'Lỗi máy chủ. Hãy thử lại sau.' });
    }

    return res.status(200).json({
        ...existingOrder.toObject({getters: true}),
        items: existingOrderItems.map(item => item.toObject({getters: true}))
    });
};


const addOrder = async (req, res) => {
    if (req.user.username === 'leduytan0706') {
        const count = await Product.countDocuments({ createdBy: req.user._id });
        if (count >= 10) {
            return res.status(403).json({ message: "Tài khoản demo chỉ được tạo tối đa 10 sản phẩm." });
        }
    }

    const {orderData} = req.body;
    const {customerName, discountAmount, debtAmount, orderDate, note, items: orderItems } = orderData;
 
    // Tạo đơn hàng mới
    const newOrder = new Order({
        customerName,
        discountAmount,
        debtAmount,
        createdAt: orderDate? new Date(orderDate): new Date(),
        note,
        createdBy: req.user._id
    });

    const session = await mongoose.startSession();
    session.startTransaction();
    let addedOrderItems;

    try {
        // lưu đơn hàng mới
        await newOrder.save({session: session});

        const newOrderItems = orderItems.map(item => ({
            ...item,
            order: newOrder._id,
            productPrice: item.product.price,
            product: item.product._id,
        }));

        // Thêm các mặt hàng trong đơn hàng 
        const result = await addOrderItems(session, newOrderItems);
        if (result instanceof Error){
            return res.status(400).json({message: result.message});
        }
        addedOrderItems = result;

        newOrder.itemQuantity = addedOrderItems.length;
        newOrder.totalItem = getTotalItem("order", addedOrderItems);
        newOrder.totalAmount = getTotalAmount("order", newOrderItems);

        await newOrder.save({session: session});
        await session.commitTransaction();
  
    } catch (error) {
        console.log(`Error in addOrder controller: ${error.message}`);
        return res.status(500).json({ message: 'Lỗi máy chủ. Hãy thử lại sau.' });
    } finally{
        session.endSession();
    }

    return res.status(201).json({
        newOrderData: newOrder.toObject({getters: true}),
        items: addedOrderItems
    });

};

const addOrderItems = async (session, orderItems) => {
    // Kiểm tra tính hợp lệ của sản phẩm
    let validItems = await validateItems(orderItems, "product");

    if (!validItems){
        return new Error("Invalid order items");
    }

    try {
        // Kiểm tra số lượng tồn trong kho
        const message = await checkProductStock(session, validItems);
        if (message){
            return new Error(message);
        } 

        const result = await OrderItem.insertMany(validItems, {
            session: session,
            strict: true
        });

        // Cập nhật lượng hàng xuất trong phiếu nhập
        const error = await updateExportQuantity(session, "addOrder", result);
        if (error instanceof Error) {
            return new Error(error);
        }

        // Cập nhật lượng hàng tồn
        await updateProductStock(session, "addOrder", result);
        
        return result.map(item => item.toObject({getters: true}));
    } catch (error) {
        console.log(`Error in addOrderItems: ${error.message}`);
        return error;
    }
};

const updateOrder = async (req, res) => {
    const orderId = req.params.id;
    if (!orderId){
        return res.status(400).json({ message: 'Order ID is required.' });
    }
    const {orderData} = req.body;
    // console.log(orderData);
    const {customerName, discountAmount, debtAmount, orderDate, note, items: orderItems} = orderData;

    const updateItemsData = orderItems.map(item => ({
        ...item,
        productPrice: item.product.price,
        product: item.product._id,
    }));

    // console.log(updateItemsData);

    const session = await mongoose.startSession();
    session.startTransaction();

    let existingOrder;
    let updatedItems;

    try {
        existingOrder = await Order.findById(orderId, {}, {
            session
        });
        if (!existingOrder){
            return res.status(404).json({ message: 'Order not found.' });
        }

        existingOrder.customerName = customerName;
        existingOrder.discountAmount = discountAmount;
        existingOrder.debtAmount = debtAmount;
        existingOrder.createdAt = orderDate? new Date(orderDate): new Date();
        existingOrder.note = note;

        // console.log(updatedOrder);
        const existingOrderItems = await OrderItem.find({order: existingOrder._id});
        if (!existingOrderItems || existingOrderItems.length === 0){
            return res.status(404).json({message: 'No order items were found for this order'});
        }

        // console.log(existingOrderItems);

        // get the productIds from the existing order items
        const existingIds = existingOrderItems.map(item => item.product.toString());
        // get the productIds from the update items data
        const updateOrderIds = updateItemsData.map(item => item.product);

        // get the items to delete (in db & not in update data)
        const itemsToDelete = existingOrderItems.filter((item) => !updateOrderIds.includes(item.product.toString()));

        // get the items to insert (not in db & in update data)
        let itemsToInsert = updateItemsData.filter(item => !item._id);
        itemsToInsert = itemsToInsert.map(item => ({
            ...item,
            order: existingOrder._id
        }));

        // get the items to update (in db & in update data)
        const itemsToUpdate = updateItemsData.filter(item => item._id && existingIds.includes(item.product));
        
        // console.log(itemsToDelete);
        // console.log(itemsToInsert);
        // console.log(itemsToUpdate);

        // perform the update
        updatedItems = await updateOrderItems(session, itemsToDelete,itemsToInsert,itemsToUpdate);
        // console.log(updatedItems);

        // update to quantity and total amount of import 
        existingOrder.itemQuantity = updatedItems.length;
        existingOrder.totalItem = getTotalItem("order", updateItemsData);
        existingOrder.totalAmount = getTotalAmount("order", updateItemsData);

        await existingOrder.save({session: session});
        await session.commitTransaction();

    } catch (error) {
        console.log(`Error in updateOrder controller: ${error.message}`);
        return res.status(500).json({ message: 'Lỗi máy chủ. Hãy thử lại sau.' });
    } finally{
        session.endSession();
    }

    return res.status(201).json({
        updatedOrderData: existingOrder.toObject({getters: true}),
        items: updatedItems
    });


};

const updateOrderItems = async (session, itemsToDelete, itemsToInsert, itemsToUpdate) => {
    // console.log(itemsToDelete);
    // console.log(itemsToInsert);
    // console.log(itemsToUpdate);
    try {
        let insertedItems = [];
        let updatedItems = [];

        // delete items
        if (itemsToDelete.length > 0){
            const result = await deleteOrderItems(session, itemsToDelete);
            if (result instanceof Error) {
                throw new Error(result.message);
            }
        }

        // insert items
        if (itemsToInsert.length > 0){
            insertedItems = await addOrderItems(session, itemsToInsert);
        }


        // update items
        if (itemsToUpdate.length > 0){
            // update import items (exportQuantity)
            const result = await updateExportQuantity(session, "updateOrder", itemsToUpdate);
            if (result instanceof Error) {
                throw result;
            }
            // update items in bulk
            updatedItems = await Promise.all(
                itemsToUpdate.map((item) =>
                  OrderItem.findByIdAndUpdate(item._id, item, { new: true, session: session }) // Return updated docs
                )
            );
            // console.log(updatedItems);
            // update product stock 
            await updateProductStock(session, "update", itemsToUpdate);

            updatedItems = updatedItems.map((item) => item.toObject({getters: true}));
        }

        if (insertedItems.length > 0){
            updatedItems = updatedItems.concat(insertedItems);
        }

        return updatedItems;
    } catch (error) {
        console.log(`Error in updateOrderItems: ${error.message}`);
        return error;
    }
};

const deleteOrder = async (req, res) => {
    const orderId = req.params.id;

    const session = await mongoose.startSession();
    session.startTransaction();

    let existingOrder;
    try {
        existingOrder = await Order.findById(orderId, {}, {session: session});
        if (!existingOrder){
            return res.status(404).json({ message: 'Order not found.' });
        }

        const existingOrderItems = await OrderItem.find({order: orderId}, {}, { session });
        if (!existingOrderItems || existingOrderItems.length === 0){
            throw new Error('No order items found for this order');
        }

        const result = await deleteOrderItems(session, existingOrderItems);
        if (result instanceof Error) {
            return res.status(400).json({ message: result.message });
        }
        await existingOrder.deleteOne({session: session});

        await session.commitTransaction();
    } catch (error) {
        console.log(`Error in deleteOrder: ${error.message}`);
        return res.status(500).json({ message: 'Lỗi máy chủ. Hãy thử lại sau.' });
    } finally{
        session.endSession();
    }
    return res.status(200).json({
        message: 'Order deleted successfully.'
    });
};

const deleteOrderItems = async (session, orderItems) => {

    try {
        const result = await updateExportQuantity(session, "deleteOrder", orderItems);
        if (result instanceof Error) {
            throw new Error(result.message);
        }
        
        await updateProductStock(session, "update", orderItems);
        await OrderItem.deleteMany({_id: {$in: orderItems.map(item => item._id)}}, { session });
    } catch (error) {
        console.log(`Error in deleteOrderItems: ${error.message}`);
        return error;
    }
};

export {getOrders, getOrdersByFilter, getOrderById, searchOrders, addOrder, updateOrder, deleteOrder}