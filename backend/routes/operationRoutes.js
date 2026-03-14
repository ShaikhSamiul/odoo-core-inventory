const express = require('express');
const router = express.Router();
// We partially built this in step 1, but we'll complete it soon
const operationController = require('../controllers/operationController');

// Inventory Ledger & Movements
router.post('/', operationController.createOperation); // Logs the movement
router.get('/', operationController.getAllOperations); // Fetches the history for the dashboard
router.put('/:id/status', operationController.updateOperationStatus); // Updates status (e.g., Draft -> Done)

module.exports = router;