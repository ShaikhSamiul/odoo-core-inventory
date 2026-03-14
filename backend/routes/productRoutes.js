const express = require('express');
const router = express.Router();
// We will build this controller next
const productController = require('../controllers/productController');

// Core Product Management
router.get('/', productController.getAllProducts);
router.post('/', productController.createProduct);
router.get('/:id', productController.getProductById);
router.put('/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

module.exports = router;
