const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);
router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/me', auth, authController.getMe);  // Add this line
router.put('/update', auth, authController.updateProfile);
module.exports = router;
