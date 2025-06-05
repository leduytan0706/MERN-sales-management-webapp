import mongoose from "mongoose";

const discountSchema = new mongoose.Schema({
    products: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
    }],
    autoApply: {type: Boolean, default: false},
    code: { type: String, default: ""},
    name: { type: String, required: true},
    minQuantity: { type: Number, default: 0},
    minAmount: { type: Number, default: 0},
    maxDiscount: { type: Number, default: Number.MAX_SAFE_INTEGER},
    applyType: {type: String, reuqired: true, enum: ["item", "order"]},
    discountPercentage: { type: Number, default: 5},
    discountAmount: {type: Number, default: 0},
    createdAt: { type: Date, default: Date.now() },
    endDate: { type: Date, default: new Date("2100-01-01") },
    note: { type: String, default: ""},
    itemOption: { type: String, enum: ["all","category","optional"]},
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
    },

}, {
    timestamps: true
});

const Discount = mongoose.model("Discount", discountSchema);

export default Discount;