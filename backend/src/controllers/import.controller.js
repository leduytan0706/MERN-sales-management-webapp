import Import from "../models/import.model.js";
import ImportItem from "../models/importItem.model.js";
import Supplier from "../models/supplier.model.js";
import mongoose from "mongoose";
import validateItems from "../utils/validateItems.js";
import {getTotalAmount} from "../utils/getTotal.js";
import Product from "../models/product.model.js";
import { Types } from "mongoose";
import formatDate from "../utils/formatDate.js";
import updateExportPrice from "../utils/updateExportPrice.js";
import updateProductStock from "../utils/updateProductStock.js";

const getImports = async (req, res) => {
    let imports;
    try {
        imports = await Import.find().limit(100).sort({createdAt: -1}).populate('supplier');
    } catch (error) {
        console.log(`Error in addImport controller: ${error.message}`);
        return res.status(500).json({ message: 'Lỗi máy chủ. Hãy thử lại sau.' });

    }

    if (!imports || imports.length === 0){
        return res.status(404).json({ message: 'Bạn chưa thêm phiếu nhập nào.' });
    }
    return res.status(200).json(imports.map((i) => i.toObject({getters: true})));
};

const getImportsBySearch = async (req, res) => {
    const searchTerm = req.query.searchTerm || "";
    let existingItems;
    let resultImports = [];
    try {
        existingItems = await ImportItem.find().populate('product');
        existingItems = existingItems.filter(item => {
            const productName = item.product.name;
            return (
                productName.toLowerCase().includes(searchTerm.toLowerCase())
            );
        });
        const itemImportIds = existingItems.map(item => item.import);
        // resultImports = await Import.find({
        //     _id: {$in: itemImportIds}
        // }).populate('supplier').sort({createdAt: -1});
        resultImports = await Import.aggregate([
            {
              $lookup: {
                from: "suppliers",
                localField: "supplier",
                foreignField: "_id",
                as: "supplier"
              }
            },
            {
              $unwind: {
                path: "$supplier",
                preserveNullAndEmptyArrays: true
              }
            },
            {
              $addFields: {
                supplierName: {
                  $getField: {
                    field: "name",
                    input: "$supplier"
                  }
                }
              }
            },
            {
                $match: {
                    $or: [
                        { _id: { $in: itemImportIds } },
                        { supplierName: { $regex: searchTerm, $options: 'i' } }
                    ]
                }
            },
            {
              $project: {
                _id: 1,
                createdAt: 1,
                supplier: "$supplier",
                note: 1,
                productQuantity: 1,
                totalAmount: 1
              }
            },
            {
              $sort: { createdAt: -1 }
            }
          ]);
        console.log(resultImports);
    } catch (error) {
        console.log(`Error in getImportBySearch controller: ${error.message}`);
        return res.status(500).json({ message: 'Lỗi máy chủ. Hãy thử lại sau.' });
    }
    return res.status(200).json(resultImports.map(import_ => ({
        ...import_,
        id: import_._id
    })));

};

const getImportsByFilter = async (req, res) => {
    const {filterData} = req.body;
    console.log(filterData);
    const {supplierId, startDate, endDate, minProductQuantity, maxProductQuantity} = filterData;
    let existingImports;

    // Convert startDate to beginning of the day
    const startOfDay = new Date(startDate);
    startOfDay.setHours(0, 0, 0, 0);

    // Convert endDate to end of the day (23:59:59.999)
    const endOfDay = new Date(endDate);
    endOfDay.setHours(23, 59, 59, 999);

    const matchConditions = {};

    if (startDate.length > 0){
        matchConditions.createdAt = {
            $gte: startOfDay
        };
    }

    if (endDate.length > 0){

        if (startDate.length > 0){
            matchConditions.createdAt['$lte'] = endOfDay;
        }
        else {
            matchConditions.createdAt = {
                $gte: new Date("1970-01-01"),
                $lte: endOfDay
            };
        }
        
    }

    if (supplierId && supplierId.length > 0){
        matchConditions.supplier = new Types.ObjectId(supplierId);
    }

    if (minProductQuantity !== "" || minProductQuantity >= 0){
        matchConditions.productQuantity = {
            $gte: Number(minProductQuantity) || 0
        };
    }

    if (maxProductQuantity !== "" || maxProductQuantity > 0){

        if (minProductQuantity !== "" || minProductQuantity >= 0){
            matchConditions.productQuantity['$lte'] = Number(maxProductQuantity);
        }
        else {
            matchConditions.productQuantity = {
                $gte: 0,
                $lte: Number(maxProductQuantity) || Number.MAX_SAFE_INTEGER
            };
        }
        
        
    }

    console.log(matchConditions);

    try {
        existingImports = await Import.aggregate([
            {
                $match: matchConditions
            },
            {
                $lookup: {
                    from: "suppliers",
                    localField: "supplier",
                    foreignField: "_id",
                    as: "supplier"
                }
            },
            {
                $unwind: {
                    path: "$supplier",
                    preserveNullAndEmptyArrays: true // optional: keeps import even if supplier is null
                }
            },
            { $project:
                {
                    _id: 1,
                    createdAt: 1,
                    supplier: "$supplier",
                    note: 1,
                    productQuantity: 1,
                    totalAmount: 1
                }
            },
            {
                $sort: {createdAt: -1}
            }
        ]);
        console.log(existingImports);
    } catch (error) {
        console.log(`Error in getImportByFilter controller: ${error.message}`);
        return res.status(500).json({ message: 'Lỗi máy chủ. Hãy thử lại sau.' });
    }

    return res.status(200).json(existingImports.map(import_ => ({
        ...import_,
        id: import_._id.toString()
    })));

};

const getImportById = async (req, res) => { 
    const importId = req.params.id;
    const existingImport = await Import.findById(importId).populate('supplier');
    if (!existingImport){
        return res.status(404).json({ message: 'Không tìm thấy phiếu nhập này.' });
    }

    let importItems;
    try {
        const objectId = new Types.ObjectId(importId);
        importItems = await ImportItem.find({import: objectId}).populate('product');
        if (!importItems || importItems.length === 0){
            return res.status(404).json({ message: 'Không tìm thấy mặt hàng nào trong phiếu nhập này.' });
        }

        return res.status(200).json({
            importData: existingImport.toObject({getters: true}),
            importItems: importItems.map(item => item.toObject({getters: true}))
        });
    } catch (error) {
        console.log(`Error in getImportById controller: ${error.message}`);
        return res.status(500).json({ message: 'Lỗi máy chủ. Hãy thử lại sau.' });

    }
};

const addImport = async (req,res) => {
    if (req.user.username === 'leduytan0706') {
        const count = await Product.countDocuments({ createdBy: req.user._id });
        if (count >= 10) {
            return res.status(403).json({ message: "Tài khoản demo chỉ được tạo tối đa 10 sản phẩm." });
        }
    }

    const {importData} = req.body;
    const {supplierId, importDate, note, items: importItems} = importData;

    // Kiểm tra nhà cung cấp tồn tại hay không
    const existingSupplier = await Supplier.findById(supplierId);
    if (!existingSupplier) {
        return res.status(404).json({ message: 'Nhà cung cấp không tồn tại trong hệ thống.' });
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    // tạo phiếu nhập mới
    const newImport = new Import({
        supplier: existingSupplier._id,
        createdAt: importDate || importDate.length > 0? new Date(importDate): new Date(),
        note,
        createdBy: req.user._id
    });
    let newImportItems;

    try {
        // thêm phiếu nhập
        await newImport.save({session: session});

        // tạo trường import
        newImportItems = importItems.map((item) => ({
            ...item,
            product: item.product._id,
            expiringDate: item.expiringDate && item.expiringDate !==""? formatDate(item.expiringDate): "",
            import: newImport._id
        }));

        // thêm các mặt hàng nhập vào bảng ImportItem
        newImportItems = await addImportItems(session, newImportItems);
        console.log(newImportItems);

        // tính toán số mặt hàng và tổng tiền
        newImport.productQuantity = newImportItems.length;
        newImport.totalAmount = getTotalAmount("import", newImportItems);

        await newImport.save({session: session});
        await session.commitTransaction();
        
    } catch (error) {
        console.log(`Error in addImport controller: ${error.message}`);
        return res.status(500).json({ message: 'Lỗi máy chủ. Hãy thử lại sau.' });
    } finally {
        session.endSession();
    }

    return res.status(201).json({
        newImportData: {
            ...newImport.toObject({getters: true}),
            supplier: existingSupplier
        },
        items: newImportItems
    });
};

const addImportItems = async (session, importItems) => {
    // Kiểm tra tính hợp lệ của sản phẩm 
    let validItems = await validateItems(importItems, "product");

    if (!validItems){
        return new Error("Mặt hàng không tồn tại trong hệ thống.");
    }
    // console.log(validItems);


    try {
        const result = await ImportItem.insertMany(validItems, {
            session: session,
        });
        // Cập nhật giá bán hàng
        await updateExportPrice(session, result);

        // Cập nhật lượng tồn
        await updateProductStock(session, "import", result);

        return result.map((item) => item.toObject({getters: true}));
    } catch (error) {
        console.log(`Error in addImportItems: ${error.message}`);
        return error;
    }
};

const updateImport = async (req,res) => {
    const importId = req.params.id;
    const {importData} = req.body;
    // console.log(importData, importItems);
    const {supplierId, importDate, note, items: importItems} = importData;
    // console.log(importDate);

    const existingSupplier = await Supplier.findById(supplierId);
    if (!existingSupplier) {
        return res.status(404).json({ message: 'Nhà cung cấp không tồn tại.' });
    }

    const updateItems = importItems.map(item => ({
        ...item,
        product: item.product._id
    }));

    const session = await mongoose.startSession();
    session.startTransaction();

    console.log(formatDate(importDate));
    let existingImport;
    let updatedItems;
    try {
        existingImport = await Import.findById(importId,{},{ session: session }
        );
        if (!existingImport){
            return res.status(404).json({ message: 'Không tìm thấy phiếu nhập này.' });
        }

        existingImport.supplier = existingSupplier._id;
        existingImport.createdAt = importDate? new Date(importDate): new Date();
        existingImport.note = note;

        await existingImport.save({session: session});

        const existingImportItems = await ImportItem.find({import: existingImport._id});
        if (!existingImportItems || existingImportItems.length === 0){
            return res.status(404).json({ message: 'Không tìm thấy mặt hàng nào trong phiếu nhập này.' });
        }
        const existingIds = existingImportItems.map(item => item.product.toString());
        const updateImportIds = updateItems.map(item => item.product);

        // Lấy các mặt hàng cần xóa (trong db & ko có trong data)
        const itemsToDelete = existingImportItems.filter((item) => !updateImportIds.includes(item.product.toString()));

        // Lấy các mặt hàng cần thêm (không trong db & có trong data)
        let itemsToInsert = updateItems.filter(item => !item._id);
        itemsToInsert = itemsToInsert.map(item => ({
            ...item,
            import: existingImport._id
        }));

        // Lấy các mặt hàng cần cập nhật (trong db & có trong data)
        const itemsToUpdate = updateItems.filter(item => item._id && existingIds.includes(item.product));
        
        // Cập nhật
        updatedItems = await updateImportItems(session, itemsToDelete, itemsToInsert, itemsToUpdate);

        // Cập nhật số mặt hàng và tổng tiền
        existingImport.productQuantity = updatedItems.length;
        existingImport.totalAmount = getTotalAmount("import", updatedItems);

        await existingImport.save({session: session});
        await session.commitTransaction();
    } catch (error) {
        console.log(`Error in updateImport: ${error.message}`);
        return res.status(500).json({ message: 'Lỗi máy chủ. Hãy thử lại sau.' });
    } finally {
        session.endSession();
    }

    return res.status(200).json({
        updatedImportData: {
            ...existingImport.toObject({getters: true}),
            supplier: existingSupplier
        },
        items: updatedItems
    });
};

const updateImportItems = async (session, itemsToDelete, itemsToInsert, itemsToUpdate) => {
    try {
        let insertedItems = [];
        let updatedItems = [];

        // delete items
        if (itemsToDelete.length > 0){
            await ImportItem.deleteMany({_id: {$in: itemsToDelete.map(item => item._id)}}, 
            {
                session: session
            });

            await updateProductStock(session, "import", itemsToDelete);
        }

        // insert items
        if (itemsToInsert.length > 0){
            insertedItems = await addImportItems(session, itemsToInsert);
        }


        // update items
        if (itemsToUpdate.length > 0){
            // update items in bulk
            updatedItems = await Promise.all(
                itemsToUpdate.map(async (item) =>
                  await ImportItem.findByIdAndUpdate(item._id, item, { 
                    new: true,
                    session: session
                }))  // Return updated docs
            );
            // console.log(updatedItems);

            await updateExportPrice(session, updatedItems);

            await updateProductStock(session, "import", updatedItems);

            updatedItems = updatedItems.map((item) => item.toObject({getters: true}));
        }

        if (insertedItems.length > 0){
            updatedItems = updatedItems.concat(insertedItems);
        }
        // console.log(updatedItems);
        return updatedItems;
    } catch (error) {
        console.log(`Error in updateImportItems: ${error.message}`);
        return error;
    }
};


const deleteImport = async (req,res) => {
    const importId = req.params.id;

    const session = await mongoose.startSession();
    session.startTransaction();

    let existingImport;
    let existingImportItems;
    try {
        existingImport = await Import.findById(importId, {}, {session: session});
        if (!existingImport){
            return res.status(404).json({ message: 'Không tìm thấy phiếu nhập này.' });
        }

        existingImportItems = await ImportItem.find({import: importId},{}, {session: session});
        if (!existingImportItems || existingImportItems.length === 0){
            return res.status(404).json({ message: 'Không tìm thấy mặt hàng nào trong phiếu nhập này.' });
        }

        await updateProductStock(session, "import", existingImportItems);
        await ImportItem.deleteMany({import: existingImport._id}, {session: session});
        await existingImport.deleteOne();

        await session.commitTransaction();
    } catch (error) {
        console.log(`Error in deleteImport: ${error.message}`);
        return res.status(500).json({ message: 'Lỗi máy chủ. Hãy thử lại sau.'});
    } finally{
        session.endSession();
    }
    return res.status(200).json({
        message: 'Xóa phiếu nhập thành công'
    });
};

export {getImports, getImportById, getImportsBySearch,  getImportsByFilter, addImport, addImportItems, updateImport, deleteImport }