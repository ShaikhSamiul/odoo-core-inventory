const mongoose = require('mongoose');

const operationSchema = new mongoose.Schema({
    type: { 
        type: String, 
        enum: ['Receipt', 'Delivery', 'Internal', 'Adjustment'], 
        required: true 
    },
    status: {
        type: String,
        enum: ['Draft', 'Waiting', 'Ready', 'Done', 'Canceled'],
        default: 'Draft'
    },
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true },
    fromLocation: { type: String }, // Used for Deliveries and Transfers
    toLocation: { type: String },   // Used for Receipts and Transfers
    reference: { type: String },    // Vendor name or Customer order ID
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Operation', operationSchema);