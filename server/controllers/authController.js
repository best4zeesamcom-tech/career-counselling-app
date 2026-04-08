const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { sendWelcomeEmail, sendPasswordResetEmail } = require('../config/email');

// Register User
exports.register = async (req, res) => {
  try {
    console.log("📝 Registration request received:", req.body);
    
    const { name, email, password } = req.body;
    console.log("📊 Extracted data:", { name, email, password: "***" });

    // Validate required fields
    if (!name || !email || !password) {
      console.log("❌ Missing required fields");
      return res.status(400).json({ 
        message: 'All fields are required: name, email, password' 
      });
    }

    // Check if user already exists
    let existingUser = await User.findOne({ email });
    console.log("🔍 Existing user check:", existingUser ? "Found" : "Not found");
    
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    console.log("✅ Password hashed successfully");

    // Create user
    const user = new User({ 
      name, 
      email, 
      password: hashedPassword,
      isVerified: true
    });
    
    await user.save();
    console.log("✅ User saved to database:", user._id);

    // Send welcome email (don't let it crash registration)
    try {
      if (sendWelcomeEmail) {
        await sendWelcomeEmail(user.email, user.name);
        console.log("📧 Welcome email sent successfully");
      }
    } catch (emailError) {
      console.error('⚠️ Welcome email failed (registration continues):', emailError.message);
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET || 'fallback_secret_key_change_this',
      { expiresIn: '7d' }
    );
    console.log("✅ JWT token generated");

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
    console.error('❌ Registration error:', error);
    console.error('❌ Error stack:', error.stack);
    
    // Send detailed error response
    res.status(500).json({ 
      message: 'Server error during registration', 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// Login User
exports.login = async (req, res) => {
  try {
    console.log("🔐 Login request received:", req.body.email);
    
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      console.log("❌ User not found:", email);
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("❌ Invalid password for:", email);
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    console.log("✅ Login successful for:", email);

    // Update last login
    if (user.updateLastLogin) {
      await user.updateLastLogin();
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET || 'fallback_secret_key_change_this',
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
    console.error('❌ Login error:', error);
    res.status(500).json({ message: 'Server error during login', error: error.message });
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

// Check if user is premium (for middleware)
exports.checkPremium = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user || !user.isPremium) {
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
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    user.isPremium = true;
    user.premiumSince = new Date();
    user.premiumExpiresAt = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000); // 1 year
    await user.save();
    
    res.json({ 
      message: 'Account upgraded to premium successfully!',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isPremium: user.isPremium,
        premiumSince: user.premiumSince,
        premiumExpiresAt: user.premiumExpiresAt
      }
    });
  } catch (error) {
    console.error('Upgrade to premium error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};