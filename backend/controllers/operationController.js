// backend/controllers/operationController.js
const Operation = require('../models/Operation');
const Product = require('../models/product');

exports.getDashboardData = async (req, res) => {
    try {
        // 1. Calculate all 5 KPIs
        const totalProducts = await Product.countDocuments();
        const lowStock = await Product.countDocuments({ $expr: { $lte: ["$stock", "$lowStockThreshold"] } });
        
        const pendingReceipts = await Operation.countDocuments({ type: 'Receipt', status: { $in: ['Draft', 'Waiting', 'Ready'] } });
        const pendingDeliveries = await Operation.countDocuments({ type: 'Delivery', status: { $in: ['Draft', 'Waiting', 'Ready'] } });
        const internalTransfers = await Operation.countDocuments({ type: 'Internal', status: { $in: ['Draft', 'Waiting', 'Ready'] } });

        // 2. Fetch Operations for the list (populated with product details for filtering)
        const recentOperations = await Operation.find()
            .populate('product', 'name sku category location uom')
            .sort({ createdAt: -1 });

        res.status(200).json({
            kpis: { totalProducts, lowStock, pendingReceipts, pendingDeliveries, internalTransfers },
            operations: recentOperations
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createOperation = async (req, res) => {
    try {
        const { type, product, quantity, fromLocation, toLocation, status, reference } = req.body;
        
        const operation = new Operation({
            type, product, quantity, fromLocation, toLocation, status, reference
        });

        if (status === 'Done') {
            const prod = await Product.findById(product);
            if (!prod) return res.status(404).json({ message: "Product not found" });

            if (type === 'Receipt') prod.stock += Number(quantity);
            else if (type === 'Delivery') {
                if (prod.stock < quantity) return res.status(400).json({ message: "Insufficient stock!" });
                prod.stock -= Number(quantity);
            } 
            else if (type === 'Adjustment') prod.stock = Number(quantity); 
            else if (type === 'Internal') prod.location = toLocation;
            
            await prod.save();
        }

        await operation.save();
        res.status(201).json({ message: "Operation processed", operation });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getAllOperations = async (req, res) => {
    try {
        const operations = await Operation.find().populate('product', 'name sku category').sort({ createdAt: -1 });
        res.status(200).json(operations);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateOperationStatus = async (req, res) => {
    res.status(200).json({ message: "Status update endpoint reached" });
};