const express = require('express');
const router = express.Router();
// We will build this controller next
const authController = require('../controllers/authController');

// Standard Auth
router.post('/signup', authController.signup);
router.post('/login', authController.login);

// OTP-based password reset
router.post('/forgot-password', authController.requestOTP);
router.post('/reset-password', authController.resetPassword);

module.exports = router;