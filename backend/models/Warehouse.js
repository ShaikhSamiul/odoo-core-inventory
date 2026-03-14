const mongoose = require('mongoose');

const warehouseSchema = new mongoose.Schema({
    name: { type: String, required: true },
    shortCode: { type: String, required: true, unique: true },
    address: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Warehouse', warehouseSchema);

