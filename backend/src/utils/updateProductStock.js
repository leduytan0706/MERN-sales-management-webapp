import ImportItem from "../models/importItem.model.js";
import Product from "../models/product.model.js"

const updateProductStock = async (session, option, items) => {
    // Update the stock based on the given option and items
    if (option === "import"){
        // console.log(items);
        await Promise.all(
            items.map(async (item) => {
                const selectedProduct = await Product.findById(item.product,{}, {
                    session: session
                });


                const totalRemainingStock = await ImportItem.aggregate([
                    {$match: {
                        product: selectedProduct._id
                    }},
                    {$group: {
                        _id: null,
                        totalStock: {$sum: {$subtract: ["$importQuantity", "$exportQuantity"]}}
                    }}
                ], {
                    session: session
                });
                console.log(totalRemainingStock);

                selectedProduct.stock = totalRemainingStock.length? totalRemainingStock[0].totalStock: 0;
                console.log(selectedProduct.stock);
                await selectedProduct.save({session: session});

            })
        );
    }
    else if (option === "addOrder") {
        await Promise.all(
            items.map(async (item) => {
                await Product.findByIdAndUpdate(item.product,{
                    $inc: {stock: -item.productQuantity}
                } , {
                    runValidators: true,
                    session: session
                });
                
            })
        )
    }
    else if (option === "deleteOrder") {
        await Promise.all(
            items.map(async (item) => {
                await Product.findByIdAndUpdate(item.product,{
                    $inc: {stock: item.productQuantity}
                } , {
                    runValidators: true,
                    session: session
                });
            })
        )
    }
};

export default updateProductStock;