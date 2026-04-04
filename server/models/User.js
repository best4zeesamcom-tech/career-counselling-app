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
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Add a method to check if user is premium and not expired
UserSchema.methods.isPremiumActive = function() {
  return this.isPremium && (!this.premiumExpiresAt || this.premiumExpiresAt > new Date());
};

module.exports = mongoose.model('User', UserSchema);