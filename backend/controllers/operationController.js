const Operation = require('../models/Operation');
const Product = require('../models/product');

exports.createOperation = async (req, res) => {
    try {
        const { type, product, quantity, fromLocation, toLocation, status } = req.body;
        
        // 1. Create the ledger entry
        const operation = new Operation({
            type, product, quantity, fromLocation, toLocation, status
        });

        // 2. If status is 'Done', update the actual product stock
        if (status === 'Done') {
            const prod = await Product.findById(product);
            if (!prod) return res.status(404).json({ message: "Product not found" });

            if (type === 'Receipt') {
                prod.stock += quantity;
            } else if (type === 'Delivery') {
                if (prod.stock < quantity) return res.status(400).json({ message: "Insufficient stock!" });
                prod.stock -= quantity;
            } else if (type === 'Adjustment') {
                // Adjustment quantity is the *exact* physical count
                prod.stock = quantity; 
            } else if (type === 'Internal') {
                // For internal transfers, total stock remains same, just update location
                prod.location = toLocation;
            }
            await prod.save();
        }

        await operation.save();
        res.status(201).json({ message: "Operation processed", operation });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
// Add this to the bottom of backend/controllers/operationController.js
exports.getAllOperations = async (req, res) => {
    try {
        const operations = await Operation.find().populate('product', 'name sku').sort({ createdAt: -1 });
        res.status(200).json(operations);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateOperationStatus = async (req, res) => {
    // We will flesh out status updates (Draft -> Done) later
    res.status(200).json({ message: "Status update endpoint reached" });
};