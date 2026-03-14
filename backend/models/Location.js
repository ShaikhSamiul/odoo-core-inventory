const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
    name: { type: String, required: true },
    shortCode: { type: String, required: true, unique: true },
    warehouse: { type: mongoose.Schema.Types.ObjectId, ref: 'Warehouse', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Location', locationSchema);