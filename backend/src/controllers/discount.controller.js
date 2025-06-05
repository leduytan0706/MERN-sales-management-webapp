import mongoose from "mongoose";
import Discount from "../models/discount.model.js";
import Product from "../models/product.model.js";
import validateItems from "../utils/validateItems.js";
import { Types } from "mongoose";
import Category from "../models/category.model.js";

const getDiscounts = async (req, res) => {
    const {productId, quantity} = req.query;
    // console.log(productId, quantity);
    try {
        if (productId && quantity){
            const response = await getProductDiscount(productId, quantity);
            console.log(response);
            return res.status(200).json({productDiscount: response});
        }
        else if (!productId && !quantity){
            const response = await getAllDiscounts();
            return res.status(200).json(response);
        }
        else {
            return res.status(400).json({ message: 'Không tìm thấy dữ liệu cần thiết' });
        }
    } catch (error) {
        console.log(`Error in getDiscounts: ${error.message}`);
        return res.status(500).json({ message: 'Có lỗi xảy ra. Vui lòng thử lại sau' });

    }
    
    
};

const getDiscountById = async (req, res) => {
    const discountId = req.params.id;
    let existingDiscount;
    try {
        existingDiscount = await Discount.findById(discountId).populate('products').populate('category');
    } catch (error) {
        console.log(`Error in getDiscountById: ${error.message}`);
        return res.status(500).json({ message: 'Có lỗi xảy ra. Vui lòng thử lại sau' });
    }
    return res.status(200).json(existingDiscount.toObject({getters: true}));
};

const getAllDiscounts = async () => {
    let existingDiscounts;
    try {
        existingDiscounts = await Discount.find().sort({createdAt: -1}).exec();
    } catch (error) {
        console.log(`Error in getDiscounts: ${error.message}`);
        return new Error('Có lỗi xảy ra. Vui lòng thử lại sau');
    }
    if (!existingDiscounts || existingDiscounts.length <= 0){
        return new Error('Bạn chưa tạo chương trình khuyến mãi nào.');
    }

    return existingDiscounts.map(discount => discount.toObject({getters: true}));
}

const getProductDiscount = async (productId, quantity) => {
    let existingDiscount;

    try {
        const objectId = new Types.ObjectId(productId);
        console.log(objectId);
        existingDiscount = await Discount.findOne({
            autoApply: true,
            products: {$in: [objectId]},
            minQuantity: {$lte: quantity},
            applyType: "item",
            createdAt: {$lte: new Date()},
            endDate: {$gte: new Date()}
        }).sort({minQuantity: -1, discountPercentage: -1});
    } catch (error) {
        console.log(`Error in getProductDiscount: ${error.message}`);
        return new Error('Có lỗi xảy ra. Vui lòng thử lại sau');
    }
    console.log(existingDiscount);

    let discountAmount = 0;
    if (!existingDiscount || existingDiscount.length <= 0) {
        discountAmount = 0;
    }
    else if (existingDiscount.discountAmount > 0){
        discountAmount = existingDiscount.discountAmount;
    }
    else if (existingDiscount.discountPercentage > 0){
        const existingProduct = await Product.findById(productId);
        if (!existingProduct) {
            return new Error('Có lỗi xảy ra. Vui lòng thử lại sau');
        }
        const itemTotal = existingProduct.price*quantity;
        discountAmount = itemTotal*existingDiscount.discountPercentage/100;
    }
    console.log(discountAmount);
    
    return discountAmount;
};

const getOrderDiscount = async (req, res) => {
    const {code, order} = req.body;
    if (!code || code.length === 0){
        return res.status(404).json({
            message: 'Mã khuyến mãi không tồn tại hoặc chưa đúng định dạng.'
        });
    }
    const {totalAmount} = order;

    let existingDiscount;
    try {
        existingDiscount = await Discount.findOne({
            code,
            autoApply: false,
            applyType: "order",
            minAmount: {$lte: totalAmount},
            createdAt: {$lte: new Date()},
            endDate: {$gte: new Date()}
        }).sort({minAmount: -1});
    } catch (error) {
        console.log(`Error in applyDiscountForOrderItems: ${error.message}`);
        return new Error('Có lỗi xảy ra. Vui lòng thử lại sau');
    }
    
    let discountAmount;
    if (existingDiscount.discountPercentage){
        discountAmount = totalAmount - totalAmount*existingDiscount.discountPercentage/100;
        discountAmount = discountAmount > existingDiscount.maxDiscount? existingDiscount.maxDiscount: discountAmount;
    } else if (existingDiscount.discountAmount) {
        discountAmount = existingDiscount.discountAmount;
    }

    return res.status(200).json({
        orderDiscount: discountAmount
    });
};

const addDiscount = async (req, res) => {
    const {discountData} = req.body;
    const {autoApply, code, name, minQuantity, minAmount, maxDiscount, discountAmount, discountPercentage, applyType, startDate, endDate, itemOption, categoryId, note, items: discountItems} = discountData;
    
    // if ((!minQuantity && !minAmount && !name && !applyType) || (!discountPercentage && !discountAmount && !name && !applyType)){
    //     return res.status(400).json({ message: 'Thông tin nhập không hợp lệ.'});
    // }
    let existingCategory;
    if (categoryId && itemOption === "category") {
        existingCategory= await Category.findById(categoryId);
        if (!existingCategory){
            return res.status(400).json({ message: 'Danh mục không tồn tại.'});
        }
    }

    let validItems;
    if (discountItems && discountItems.length > 0){
        validItems = await validateItems(discountItems, "_id");
        // console.log(discountItems);
        if (!validItems){
            return res.status(400).json({ message: 'Danh sách mặt hàng không hợp lệ.'});
        }
    }

    let newDiscount;
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        let discountItemsId;
        if (validItems && validItems.length > 0){
            discountItemsId = validItems.map(item => item._id);
        }        
        
        newDiscount = new Discount({
            autoApply,
            code: code || "",
            name,
            minQuantity: minQuantity || 0,
            minAmount: minAmount || 0,
            maxDiscount: maxDiscount || 0,
            applyType,
            discountPercentage: discountPercentage || 0,
            discountAmount: discountAmount || 0,
            createdAt: startDate || startDate.length > 0? new Date(startDate): new Date(),
            endDate: endDate || endDate.length > 0? new Date(endDate): new Date("2100-01-01"),
            itemOption: itemOption,
            note,
            products: discountItemsId || [],
            category: existingCategory? existingCategory._id : null
        });

        await newDiscount.save({session: session});
        await session.commitTransaction();
        
    } catch (error) {
        console.log(`Error in addDiscount: ${error.message}`);
        return res.status(500).json({ message: 'Có lỗi xảy ra. Vui lòng thử lại sau' });
    } finally{
        await session.endSession();
    }

    return res.status(201).json(newDiscount.toObject({ getters: true }));
};

const updateDiscount = async (req, res) => {
    const discountId = req.params.id;
    const {discountData} = req.body;
    const {autoApply, code, name, minQuantity, minAmount, maxDiscount, discountAmount, discountPercentage, applyType, startDate, endDate, itemOption, categoryId, note, items: discountItems} = discountData;
    
    let existingCategory;
    if (categoryId && itemOption === "category") {
        existingCategory= await Category.findById(categoryId);
        if (!existingCategory){
            return res.status(400).json({ message: 'Danh mục không tồn tại.'});
        }
    }

    let validItems;
    if (discountItems && discountItems.length > 0){
        validItems = await validateItems(discountItems, "_id");
        // console.log(discountItems);
        if (!validItems){
            return res.status(400).json({ message: 'Danh sách mặt hàng không hợp lệ.'});
        }
    }
    

    let existingDiscount;
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        existingDiscount = await Discount.findById(discountId, {},{session});
        if (!existingDiscount) {
            return res.status(404).json({ message: 'Không tìm thấy chương trình khuyến mãi.' });
        }
        let discountItemsId;
        if (validItems && validItems.length > 0){
            discountItemsId = validItems.map(item => item._id);
        }

        existingDiscount.autoApply = autoApply;
        existingDiscount.code = code || "";
        existingDiscount.name = name;
        existingDiscount.minQuantity = minQuantity || 0;
        existingDiscount.minAmount = minAmount || 0;
        existingDiscount.maxDiscount = maxDiscount || 0;
        existingDiscount.discountPercentage = discountPercentage || 0;
        existingDiscount.discountAmount = discountAmount || 0;
        existingDiscount.applyType = applyType;
        existingDiscount.createdAt = startDate || startDate.length > 0? new Date(startDate): new Date();
        existingDiscount.endDate = endDate || endDate.length > 0? new Date(endDate): new Date("2100-01-01");
        existingDiscount.note = note;
        existingDiscount.itemOption = itemOption;
        existingDiscount.products = discountItemsId || [];
        existingDiscount.category =  existingCategory? existingCategory._id : null;

        await existingDiscount.save({session: session});
        await session.commitTransaction();
        
    } catch (error) {
        console.log(`Error in updateDiscount: ${error.message}`);
        return res.status(500).json({ message: 'Có lỗi xảy ra. Vui lòng thử lại sau' });
    } finally{
        await session.endSession();
    }

    return res.status(201).json(existingDiscount.toObject({ getters: true }));
};

const deleteDiscount = async (req, res) => {
    const discountId = req.params.id;
    try {
        const response = await Discount.findByIdAndDelete(discountId);
        if (!response) {
            return res.status(404).json({ message: 'Không tìm thấy chương trình khuyến mãi.' });
        }
    } catch (error) {
        console.log(`Error in deleteDiscount: ${error.message}`);
        return res.status(500).json({ message: 'Có lỗi xảy ra. Vui lòng thử lại sau' });
    }

    return res.status(200).json({ message: 'Xóa chương trình khuyến mãi thành công.' });
};

export {getDiscounts, getDiscountById, getOrderDiscount, addDiscount, updateDiscount, deleteDiscount};