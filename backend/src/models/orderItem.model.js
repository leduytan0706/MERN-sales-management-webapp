import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
    order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
        required: true
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
    },
    productQuantity: { type: Number, required: true},
    itemDiscount: {type: Number, default: 0}
}, {
    timestamps: true
});

const OrderItem = mongoose.model("OrderItem", orderItemSchema);

export default OrderItem;