const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');
// Remove this line - passport is already available globally
// const passport = require('../config/passport');

// ========== LOCAL AUTH ROUTES ==========
router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/me', auth, authController.getMe);
router.put('/update', auth, authController.updateProfile);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);

// ========== GOOGLE OAUTH ROUTES ==========
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/api/auth/social-failed' }),
  authController.socialLoginSuccess
);

// ========== FACEBOOK OAUTH ROUTES ==========
router.get('/facebook',
  passport.authenticate('facebook', { scope: ['email'] })
);

router.get('/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/api/auth/social-failed' }),
  authController.socialLoginSuccess
);

// ========== SOCIAL LOGIN CALLBACK ==========
router.get('/social-failed', authController.socialLoginFailed);

// ========== DEBUG: Log all registered routes ==========
console.log("✅ Auth routes registered:");
router.stack.forEach(r => {
  if (r.route && r.route.path) {
    console.log(`  - ${Object.keys(r.route.methods).join(', ').toUpperCase()} /api/auth${r.route.path}`);
  }
});

module.exports = router;