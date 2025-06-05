import Product from "../models/product.model.js";

const validateItems = async (items, idField) => {
    // console.log(items);
    let productIds = await Product.find({}).distinct('_id');
    if (!productIds) {
        return null;
    }

    productIds = productIds.map(productId => productId.toString());

    // console.log(productIds);

    // get valid import items
    let validItems = items.filter((item) => {
        return productIds.includes(item[idField]);
    });
    if (validItems.length === 0){
        return null;
    }
    return validItems;
};

export default validateItems;