import Category from "../models/category.model.js";
import Product from "../models/product.model.js";
import { Types } from "mongoose";

const updateCategoryQuantityById = async (categoryId) => {
    try {
        const categoryProductsCount = await Product.countDocuments({ category: categoryId });
        console.log(categoryProductsCount);

        const result = await Category.findByIdAndUpdate(categoryId, {
            product_quantity: categoryProductsCount
        }, {
            new: true
        });
        return result;
    } catch (error) {
        console.log(`Error in updateCategoryProducts: ${error.message}`);
        return error;
    }

};

const updateAllCategoryQuantity = async () => {
    try {
        const categoriesQuantity = await Product.aggregate([
            {
                $group: {
                    _id: "$category",
                    productCount: {$sum: 1}
                }
            }
        ]);
        const categoryUpdates = [];
        for (let category of categoriesQuantity){
            categoryUpdates.push = {
                updateOne: {
                    filter: { _id: category._id},
                    update: { $set: { product_quantity: category.productCount} }
                }
            }
        }

        await Category.bulkWrite(categoryUpdates);
        return true;
    } catch (error) {
        console.log(`Error in updateCategoryProducts: ${error.message}`);
        return error;
    }
}

export {updateCategoryQuantityById, updateAllCategoryQuantity};
