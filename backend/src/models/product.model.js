import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    barcode: { type: String, unique: true},
    name: { type: String, required: true},
    price: { type: Number, min: 0},
    unit: { type: String, required: true},
    stock: { type: Number, default: 0, min: 0},
    stockNorm: { type: Number, default: 5, min: 0},
    image: { type: String, default: ''},
    note: { type: String, default: ''},
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    suppliers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Supplier',
            required: true
        }
    ],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    }
},
{
    timestamps: true
});

const Product = mongoose.model('Product',productSchema);

export default Product;