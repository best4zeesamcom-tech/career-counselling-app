const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  profilePicture: {
    url: String,
    publicId: String
  },
  bio: {
    type: String,
    maxlength: 500,
    default: ''
  },
  education: {
    type: String,
    enum: ['matric', 'fsc', 'university', 'other'],
    default: 'other'
  },
  city: {
    type: String,
    default: ''
  },
  phone: {
    type: String,
    default: ''
  },
  resume: {
    filename: {
      type: String,
      default: null
    },
    path: {
      type: String,
      default: null
    },
    originalName: {
      type: String,
      default: null
    },
    fileSize: {
      type: Number,
      default: null
    },
    uploadedAt: {
      type: Date,
      default: null
    }
  },
  savedJobs: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'JobListing'
  }],
  isPremium: {
    type: Boolean,
    default: false
  },
  premiumExpiresAt: {
    type: Date,
    default: null
  },
  premiumPlan: {
    type: String,
    enum: ['basic', 'premium', 'enterprise'],
    default: 'basic'
  },
  paymentHistory: [{
    amount: {
      type: Number,
      required: true
    },
    method: {
      type: String,
      enum: ['JazzCash', 'EasyPaisa', 'Credit Card'],
      required: true
    },
    transactionId: {
      type: String,
      required: true,
      unique: true
    },
    plan: {
      type: String,
      enum: ['premium', 'enterprise'],
      default: 'premium'
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'pending'
    },
    date: {
      type: Date,
      default: Date.now
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastLogin: {
    type: Date,
    default: null
  },
  accountStatus: {
    type: String,
    enum: ['active', 'suspended', 'deleted'],
    default: 'active'
  }
  ,resetPasswordToken: {      // ← ADD THIS
    type: String,
    default: null
  },
  resetPasswordExpires: {    // ← ADD THIS
    type: Date,
    default: null
  },
  jobAlertEnabled: {         // ← ADD THIS
    type: Boolean,
    default: true
  }
});

// Add a method to check if user is premium and not expired
UserSchema.methods.isPremiumActive = function() {
  return this.isPremium && (!this.premiumExpiresAt || this.premiumExpiresAt > new Date());
};

// Add a method to get remaining premium days
UserSchema.methods.getRemainingPremiumDays = function() {
  if (!this.premiumExpiresAt) return 0;
  const remaining = Math.ceil((this.premiumExpiresAt - new Date()) / (1000 * 60 * 60 * 24));
  return remaining > 0 ? remaining : 0;
};

// Add a method to upgrade to premium
UserSchema.methods.upgradeToPremium = async function(plan, amount, transactionId, method) {
  this.isPremium = true;
  this.premiumPlan = plan;
  this.premiumExpiresAt = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000); // 1 year
  this.paymentHistory.push({
    amount,
    method,
    transactionId,
    plan,
    status: 'completed',
    date: new Date()
  });
  await this.save();
  return true;
};

// Add a method to check user's premium status with detailed info
UserSchema.methods.getPremiumStatus = function() {
  return {
    isPremium: this.isPremiumActive(),
    plan: this.premiumPlan,
    expiresAt: this.premiumExpiresAt,
    remainingDays: this.getRemainingPremiumDays(),
    totalPaid: this.paymentHistory.reduce((sum, p) => sum + p.amount, 0)
  };
};

// Static method to find all premium users
UserSchema.statics.getAllPremiumUsers = function() {
  return this.find({ 
    isPremium: true, 
    premiumExpiresAt: { $gt: new Date() } 
  });
};

// Update lastLogin on each login
UserSchema.methods.updateLastLogin = async function() {
  this.lastLogin = new Date();
  await this.save();
};

module.exports = mongoose.model('User', UserSchema);
