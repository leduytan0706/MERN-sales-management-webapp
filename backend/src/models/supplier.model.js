import mongoose from "mongoose";

const supplierSchema = new mongoose.Schema({
    name: { type: String, required: true},
    phone: { type: String, required: true, unique: true},
    address: { type: String },
    image: { type: String, default: ''},
    note: { type: String, default: ''},
    products: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product'
        }
    ]

},
{
    timestamps: true
});

const Supplier = mongoose.model('Supplier', supplierSchema);

export default Supplier;