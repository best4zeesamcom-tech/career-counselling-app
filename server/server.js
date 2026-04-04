const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const paymentRoutes = require('./routes/paymentRoutes');
// Import routes
const authRoutes = require('./routes/authRoutes');
const careerRoutes = require('./routes/careerRoutes');
const jobRoutes = require('./routes/jobRoutes');

const app = express();

// Middleware - IMPORTANT: Place this BEFORE routes
app.use(cors());
app.use(express.json());
app.use('/api/payment', paymentRoutes);
app.use('/uploads', express.static('uploads'));
// MongoDB Connection
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/career-app');
        console.log('✅ MongoDB Connected Successfully');
    } catch (error) {
        console.error('❌ MongoDB Connection Error:', error.message);
        process.exit(1);
    }
};

connectDB();

// Routes - ORDER MATTERS: Specific routes before general ones
app.use('/api/auth', authRoutes);
app.use('/api/careers', careerRoutes);
app.use('/api/jobs', jobRoutes);

// Basic route
app.get('/', (req, res) => {
    res.json({ 
        message: 'Career Counselling API is running 🚀',
        status: 'active',
        version: '1.0.0',
        endpoints: {
            auth: '/api/auth',
            careers: '/api/careers',
            jobs: '/api/jobs'
        }
    });
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ 
        status: 'healthy', 
        timestamp: new Date().toISOString(),
        mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
    });
});

// 404 handler for undefined routes
app.use((req, res) => {
    res.status(404).json({ 
        message: 'Route not found',
        requestedUrl: req.url,
        availableEndpoints: ['/', '/health', '/api/auth', '/api/careers', '/api/jobs']
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        message: 'Something went wrong!',
        error: err.message 
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📡 API URL: http://localhost:${PORT}`);
    console.log(`❤️  Health check: http://localhost:${PORT}/health`);
    console.log(`📋 Jobs API: http://localhost:${PORT}/api/jobs`);
    console.log(`🎓 Careers API: http://localhost:${PORT}/api/careers`);
});