const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Parses incoming JSON requests

// Database Connection
// Simplified: Modern Mongoose doesn't need the useNewUrlParser options
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ MongoDB Connected successfully"))
    .catch(err => {
        console.error("❌ DB Connection Error:");
        console.error(err.message);
        // Helpful tip: Check if your IP is whitelisted in MongoDB Atlas
    });

// Basic Test Route (to verify server is alive)
app.get('/', (req, res) => {
    res.send("Inventory API is running...");
});

// Routes
// Note: Ensure these files exist in /routes/ folder or the server will crash
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/operations', require('./routes/operationRoutes'));
app.use('/api/warehouses', require('./routes/warehouseRoutes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
