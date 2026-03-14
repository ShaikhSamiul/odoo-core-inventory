// backend/routes/operationRoutes.js
const express = require('express');
const router = express.Router();
const operationController = require('../controllers/operationController');

// ADD THIS LINE:
router.get('/dashboard', operationController.getDashboardData); 

router.post('/', operationController.createOperation);
router.get('/', operationController.getAllOperations);
router.put('/:id/status', operationController.updateOperationStatus);

module.exports = router;