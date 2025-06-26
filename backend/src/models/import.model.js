import mongoose from 'mongoose';

const importSchema = new mongoose.Schema({
    supplier: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Supplier',
        required: true
    },
    note: { type: String, default: ''},
    productQuantity: { type: Number, default: 0},
    totalAmount: { type: Number, default: 0},
    createdAt: { type: Date, default: Date.now()},
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    }
},{
    timestamps: true
});

const Import = mongoose.model('Import', importSchema);

export default Import;