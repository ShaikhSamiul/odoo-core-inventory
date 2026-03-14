const express = require('express');
const router = express.Router();
const warehouseController = require('../controllers/warehouseController');

// Routes for Warehouses
router.post('/', warehouseController.createWarehouse);
router.get('/', warehouseController.getWarehouses);

// Routes for Locations
router.post('/locations', warehouseController.createLocation);
router.get('/locations', warehouseController.getLocations);

module.exports = router;