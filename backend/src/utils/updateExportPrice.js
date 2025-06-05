import Product from "../models/product.model.js";

const updateExportPrice = async (session, importItems) => {
    // console.log(importItems);
    importItems.map(async (item) => {
        await Product.findByIdAndUpdate(item.product, {
            price: item.exportPrice
        }, {
            session: session
        });
    });

};

export default updateExportPrice;