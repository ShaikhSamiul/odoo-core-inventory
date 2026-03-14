const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    sku: { type: String, required: true, unique: true },
    category: { type: String, required: true },
    uom: { type: String, required: true }, // Unit of Measure (e.g., kg, pcs)
    stock: { type: Number, default: 0 },
    lowStockThreshold: { type: Number, default: 10 },
    location: { type: String, default: 'Main Warehouse' }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);