import Product from "../models/product.model.js";

const checkProductStock = async (session, orderItems) => {
    try {
        const result = await Promise.all(
            orderItems.map(async (item) => {
                const selectedProduct = await Product.findById(item.product, {}, {session: session});
                if (selectedProduct.stock < item.productQuantity){
                    throw new Error(`Số lượng tồn không đủ cho mặt hàng ${selectedProduct.name}`);
                }
            })
        );
        if (result.length === orderItems.length){
            return null;
        }
    } catch (error) {
        console.log(`Error in checkProductStock: ${error.message}`);
        return error.message;
    }
    
};

export default checkProductStock;