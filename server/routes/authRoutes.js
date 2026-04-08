const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');

console.log("\n✅ Loading auth routes...");

// ========== LOCAL AUTH ROUTES ONLY ==========
router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/me', auth, authController.getMe);
router.put('/update', auth, authController.updateProfile);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);
router.post('/upgrade', auth, authController.upgradeToPremium);

// ========== TEST ROUTE ==========
router.get('/test', (req, res) => {
  res.json({ message: "Auth routes are working!" });
});

console.log("✅ Auth routes registered:");
console.log("  POST   /api/auth/register");
console.log("  POST   /api/auth/login");
console.log("  GET    /api/auth/me");
console.log("  PUT    /api/auth/update");
console.log("  POST   /api/auth/forgot-password");
console.log("  POST   /api/auth/reset-password");
console.log("  POST   /api/auth/upgrade");
console.log("  GET    /api/auth/test");

module.exports = router;