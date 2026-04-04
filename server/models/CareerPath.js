const mongoose = require('mongoose');

const CareerPathSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    educationLevel: {
        type: String,
        enum: ['matric', 'fsc', 'university'],
        required: true
    },
    description: {
        type: String,
        required: true
    },
    skills: [String],
    averageSalary: String,
    jobMarket: String,
    universities: [String],
    duration: String
});

module.exports = mongoose.model('CareerPath', CareerPathSchema);