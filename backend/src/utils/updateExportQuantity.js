import ImportItem from "../models/importItem.model.js";
import OrderItem from "../models/orderItem.model.js";


const updateExportQuantity = async (session, option, orderItems) => {
    try {
        if (option === "addOrder"){
            for (const item of orderItems) {
        
                const result = await addExportQuantity (session, item.product, item.productQuantity);
                if (result instanceof Error){
                    throw result;
                }
            }
            
        }
        else if (option === "updateOrder"){
            // console.log(orderItems);
            
            for (const item of orderItems){
                // console.log(item);
                const oldOrderItem = await OrderItem.findById(item._id, {}, {session});
                // console.log(oldOrderItem);
                const qtyDiff = oldOrderItem.productQuantity - item.productQuantity;
                // console.log(qtyDiff);
                let result;
                if (qtyDiff < 0){
                    result = await addExportQuantity(session, oldOrderItem.product, -qtyDiff);
                }
                else if (qtyDiff > 0){
                    result = await deleteExportQuantity(session, oldOrderItem.product, qtyDiff);
                }
                else {
                    result = null; // No need to update exportQuantity for this item
                }
                if (result instanceof Error){
                    throw result;
                }
            }
            
        }
        else if (option === "deleteOrder"){
            for (const item of orderItems) {
                console.log(item);
                const result = await deleteExportQuantity(session, item.product, item.productQuantity);
                if (result instanceof Error){
                    throw result;
                }
            }
            
        } 
    } catch (error) {
        console.log(`Error in updateExportQuantity: ${error.message}`);
        return error;
    }
};

const addExportQuantity = async (session, productId, productQuantity) => {
    let remainingQuantity = productQuantity;
    while (remainingQuantity > 0) {
        const importItem = await ImportItem.findOne(
            {
                product: productId,
                $expr: { $gt: ["$importQuantity", "$exportQuantity"] }
            }
        ).sort({ createdAt: 1 }).session(session);

        if (!importItem) {
            throw new Error("Error updating exportQuantity, importItem info and product info is not similar");
        }

        // console.log(importItem);

        const allocatedQuantity = Math.min(remainingQuantity, importItem.importQuantity - importItem.exportQuantity);
        // console.log(allocatedQuantity);

        importItem.exportQuantity += allocatedQuantity;
        await importItem.save({ session });

        remainingQuantity -= allocatedQuantity;
    }

    return remainingQuantity;
};

const deleteExportQuantity = async (session, productId, productQuantity) => {
    let remainingQuantity = productQuantity;
    while (remainingQuantity > 0) {
        const importItem = await ImportItem.findOne(
            {
                product: productId,
                $expr: {
                    $and: [
                        {$gte: ["$importQuantity", "$exportQuantity"] },
                        {$gt: ["$exportQuantity", 0]}
                    ]
                }
            }
        ).sort({ createdAt: -1 }).session(session);
        // console.log(importItem);

        if (!importItem) {
            throw new Error(`Error updating exportQuantity, importItem info and product info is not similar for ${productId}`);
        }

        // console.log(importItem);

        const allocatedQuantity = Math.min(remainingQuantity, importItem.exportQuantity);
        // console.log(allocatedQuantity);

        importItem.exportQuantity -= allocatedQuantity;
        await importItem.save({ session });

        remainingQuantity -= allocatedQuantity;
    }
    return remainingQuantity;
};

export default updateExportQuantity;