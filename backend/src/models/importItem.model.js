import mongoose from 'mongoose';

const importItemSchema = new mongoose.Schema({
    import: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Import',
        required: true
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    importQuantity: { type: Number, required: true},
    importPrice: { type: Number, required: true},
    exportPrice: {type: Number, default: 0},
    exportQuantity: {type: Number, default: 0},
    expiringDate:{ type: String, default: ""}   
},{
    timestamps: true
});

const ImportItem = mongoose.model('ImportItem', importItemSchema);

export default ImportItem;