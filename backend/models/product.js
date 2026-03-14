const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    sku: { type: String, required: true, unique: true },
    category: { type: String, required: true },
    uom: { type: String, required: true }, // Unit of Measure (e.g., kg, pcs)
    stock: { type: Number, default: 0 },
    lowStockThreshold: { type: Number, default: 10 },
    
    // UPDATED: Now strongly linked to your new Warehouse model
    warehouse: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Warehouse',
        required: true 
    },
    
    // OPTIONAL: Linked to a specific Location (like Rack A1) within that warehouse
    location: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Location' 
    }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);