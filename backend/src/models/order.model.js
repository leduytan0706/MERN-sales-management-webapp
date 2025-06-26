import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
    customerName: { type: String, default: ""},
    totalItem: { type: Number, default: 0},
    totalAmount: {type: Number, default: 0},
    itemQuantity: { type: Number, default: 0},
    discountAmount: { type: Number, default: 0},
    debtAmount: { type: Number, default: 0},
    createdAt: { type: Date, default: Date.now() },
    note: { type: String, default: ""},
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    }
}, {
    timestamps: true
});

const Order = mongoose.model('Order', orderSchema);

export default Order;