const mongoose = require('mongoose');

const JobListingSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    company: {
        type: String,
        required: true,
        trim: true
    },
    location: {
        type: String,
        required: true,
        trim: true
    },
    type: {
        type: String,
        enum: ['full-time', 'part-time', 'internship', 'remote', 'contract'],
        default: 'full-time'
    },
    description: {
        type: String,
        default: ''
    },
    requirements: [{
        type: String,
        trim: true
    }],
    applyLink: {
        type: String,
        required: true,
        trim: true
    },
    salary: {
        type: String,
        default: 'Competitive'
    },
    isActive: {
        type: Boolean,
        default: true
    },
    postedAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Update the updatedAt field on save
JobListingSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('JobListing', JobListingSchema);