const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { sendWelcomeEmail, sendPasswordResetEmail } = require('../config/email');

// Register User
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    let existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = new User({ 
      name, 
      email, 
      password: hashedPassword,
      isVerified: true // Since they registered with email/password
    });
    await user.save();

    // Send welcome email (don't block on error)
    try {
      await sendWelcomeEmail(user.email, user.name);
    } catch (emailError) {
      console.error('Welcome email failed:', emailError);
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isPremium: user.isPremium || false,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Login User
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Update last login
    await user.updateLastLogin();

    // Generate JWT
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isPremium: user.isPremium || false,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get Current User
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update User Profile
exports.updateProfile = async (req, res) => {
  try {
    const { name, bio, city, phone, education } = req.body;
    
    const updateFields = {};
    if (name) updateFields.name = name;
    if (bio !== undefined) updateFields.bio = bio;
    if (city !== undefined) updateFields.city = city;
    if (phone !== undefined) updateFields.phone = phone;
    if (education !== undefined) updateFields.education = education;
    
    const user = await User.findByIdAndUpdate(
      req.user.userId,
      updateFields,
      { new: true }
    ).select('-password');
    
    res.json(user);
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Forgot Password
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();
    
    // Send reset email
    try {
      await sendPasswordResetEmail(user.email, resetToken, user.name);
      res.json({ message: 'Password reset email sent' });
    } catch (emailError) {
      console.error('Reset email failed:', emailError);
      res.status(500).json({ message: 'Failed to send email' });
    }
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Reset Password
exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });
    
    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }
    
    // Hash new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
    
    res.json({ message: 'Password reset successful' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ========== SOCIAL LOGIN HANDLERS ==========

// Social Login Success Handler
exports.socialLoginSuccess = async (req, res) => {
  try {
    console.log("✅ Social login success for user:", req.user?.email);
    
    // Make sure user exists
    if (!req.user) {
      throw new Error('No user data from OAuth');
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { userId: req.user._id, email: req.user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    // Prepare user data for frontend
    const userData = {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      isPremium: req.user.isPremium || false
    };
    
    // Encode user data for URL
    const encodedUserData = encodeURIComponent(JSON.stringify(userData));
    
    // Get frontend URL from env or use default
    const frontendUrl = process.env.FRONTEND_URL || 'https://career-counselling-app-kappa.vercel.app';
    
    // Redirect to frontend with token and user data
    res.redirect(`${frontendUrl}/social-login?token=${token}&user=${encodedUserData}`);
    
  } catch (error) {
    console.error('❌ Social login success error:', error);
    const frontendUrl = process.env.FRONTEND_URL || 'https://career-counselling-app-kappa.vercel.app';
    res.redirect(`${frontendUrl}/login?error=social_login_failed&message=${encodeURIComponent(error.message)}`);
  }
};

// Social Login Failed Handler
exports.socialLoginFailed = (req, res) => {
  console.log("❌ Social login failed");
  const frontendUrl = process.env.FRONTEND_URL || 'https://career-counselling-app-kappa.vercel.app';
  res.redirect(`${frontendUrl}/login?error=social_auth_failed`);
};

// ========== HELPER FUNCTIONS ==========

// Check if user is premium (for middleware)
exports.checkPremium = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user.isPremium) {
      return res.status(403).json({ message: 'Premium subscription required' });
    }
    next();
  } catch (error) {
    console.error('Premium check error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Upgrade to premium
exports.upgradeToPremium = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    user.isPremium = true;
    user.premiumSince = new Date();
    await user.save();
    
    res.json({ 
      message: 'Account upgraded to premium successfully!',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isPremium: user.isPremium,
        premiumSince: user.premiumSince
      }
    });
  } catch (error) {
    console.error('Upgrade to premium error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
exports.upgradeToPremium = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    user.isPremium = true;
    user.premiumSince = new Date();
    await user.save();
    
    res.json({ 
      message: 'Account upgraded to premium successfully!',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isPremium: user.isPremium,
        premiumSince: user.premiumSince
      }
    });
  } catch (error) {
    console.error('Upgrade to premium error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};