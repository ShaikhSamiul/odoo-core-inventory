const Warehouse = require('../models/Warehouse');
const Location = require('../models/Location');

// --- WAREHOUSE LOGIC ---

exports.createWarehouse = async (req, res) => {
    try {
        const warehouse = await Warehouse.create(req.body);
        res.status(201).json(warehouse);
    } catch (error) {
        // Handle duplicate shortCode error gracefully
        if (error.code === 11000) return res.status(400).json({ message: "Warehouse short code must be unique." });
        res.status(500).json({ error: error.message });
    }
};

exports.getWarehouses = async (req, res) => {
    try {
        const warehouses = await Warehouse.find();
        res.status(200).json(warehouses);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// --- LOCATION LOGIC ---

exports.createLocation = async (req, res) => {
    try {
        const location = await Location.create(req.body);
        res.status(201).json(location);
    } catch (error) {
        if (error.code === 11000) return res.status(400).json({ message: "Location short code must be unique." });
        res.status(500).json({ error: error.message });
    }
};

exports.getLocations = async (req, res) => {
    try {
        // .populate() pulls in the actual Warehouse data, not just the ID!
        const locations = await Location.find().populate('warehouse', 'name shortCode');
        res.status(200).json(locations);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

