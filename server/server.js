require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Import routes
const authRoutes = require('./routes/authRoutes');
const careerRoutes = require('./routes/careerRoutes');
const jobRoutes = require('./routes/jobRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

// ========== MIDDLEWARE ==========
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Static files
app.use('/uploads', express.static('uploads'));

// ========== BASIC ROUTES ==========
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

app.get('/health', (req, res) => {
    res.json({ 
        status: 'healthy', 
        timestamp: new Date().toISOString(),
        mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
    });
});

// ========== API ROUTES ==========
console.log("\n📋 Mounting API Routes:");
app.use('/api/auth', authRoutes);
console.log("  ✅ Auth routes mounted at /api/auth");

app.use('/api/careers', careerRoutes);
console.log("  ✅ Career routes mounted at /api/careers");

app.use('/api/jobs', jobRoutes);
console.log("  ✅ Job routes mounted at /api/jobs");

app.use('/api/payment', paymentRoutes);
console.log("  ✅ Payment routes mounted at /api/payment");

// ========== MONGODB CONNECTION ==========
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/career-app');
        console.log('\n✅ MongoDB Connected Successfully');
    } catch (error) {
        console.error('❌ MongoDB Connection Error:', error.message);
        process.exit(1);
    }
};

// ========== START SERVER ==========
const PORT = process.env.PORT || 5000;
const HOST = '0.0.0.0';

// Connect to DB then start server
connectDB().then(() => {
  app.listen(PORT, HOST, () => {
      console.log(`\n🚀 Server running on http://${HOST}:${PORT}`);
      console.log(`📡 Local API URL: http://localhost:${PORT}`);
      console.log(`❤️  Health check: http://localhost:${PORT}/health`);
      console.log(`📋 Jobs API: http://localhost:${PORT}/api/jobs`);
      console.log(`🎓 Careers API: http://localhost:${PORT}/api/careers`);
      console.log(`\n✅ Server ready!`);
  });
});

// ========== 404 HANDLER ==========
app.use((req, res) => {
    console.log(`❌ 404: ${req.method} ${req.url}`);
    res.status(404).json({ 
        message: 'Route not found',
        requestedUrl: req.url,
        availableEndpoints: ['/', '/health', '/api/auth', '/api/careers', '/api/jobs', '/api/payment']
    });
});

// ========== ERROR HANDLER ==========
app.use((err, req, res, next) => {
    console.error('❌ Server Error:', err.stack);
    res.status(500).json({ 
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
});


console.log("🔍 Auth routes type:", typeof authRoutes);
console.log("🔍 Auth routes methods:", Object.keys(authRoutes));
console.log("🔍 Auth routes stack:", authRoutes.stack);