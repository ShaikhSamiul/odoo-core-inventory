// backend/seed.js
const mongoose = require('mongoose');
require('dotenv').config();
const Product = require('./models/product');
const Operation = require('./models/Operation');

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to DB for seeding...");

        // Clear existing data
        await Product.deleteMany();
        await Operation.deleteMany();

        // 1. Create Electronics Products with STRICT Low Stock Thresholds
        const products = await Product.insertMany([
            { name: "Apple MacBook Pro 16-inch", sku: "LAP-MAC-016", category: "Laptops", uom: "Pcs", stock: 45, lowStockThreshold: 10, location: "Warehouse 1" },
            { name: "Samsung Galaxy S24 Ultra", sku: "MOB-SAM-024", category: "Smartphones", uom: "Pcs", stock: 120, lowStockThreshold: 30, location: "Warehouse 2" },
            
            // INTENTIONALLY LOW STOCK: Stock is 8, but Alert triggers at 15
            { name: "Sony WH-1000XM5 Headphones", sku: "AUD-SON-XM5", category: "Audio", uom: "Pcs", stock: 8, lowStockThreshold: 15, location: "Warehouse 1" }, 
            
            { name: "LG C3 65-inch OLED TV", sku: "DIS-LGC-065", category: "Displays", uom: "Pcs", stock: 12, lowStockThreshold: 5, location: "Warehouse 3" },
            
            // INTENTIONALLY OUT OF STOCK: Stock is 0, Alert triggers at 20
            { name: "Dell UltraSharp 27-inch Monitor", sku: "DIS-DEL-027", category: "Displays", uom: "Pcs", stock: 0, lowStockThreshold: 20, location: "Warehouse 2" } 
        ]);

        // 2. Sample Operations
        await Operation.insertMany([
            { type: "Receipt", status: "Done", product: products[0]._id, quantity: 50, toLocation: "Warehouse 1", reference: "PO-Apple-Direct" },
            { type: "Delivery", status: "Waiting", product: products[1]._id, quantity: 5, fromLocation: "Warehouse 2", reference: "SO-Retail-Store-A" },
            { type: "Internal", status: "Ready", product: products[3]._id, quantity: 2, fromLocation: "Warehouse 3", toLocation: "Warehouse 1", reference: "Rebalancing stock" },
            { type: "Receipt", status: "Draft", product: products[2]._id, quantity: 100, toLocation: "Warehouse 1", reference: "PO-Sony-Distributor" }
        ]);

        console.log("📱 Electronics Inventory Seeded! Low Stock Alerts are active.");
        process.exit();
    } catch (error) {
        console.error("❌ Seeding Error:", error);
        process.exit(1);
    }
};

seedData();