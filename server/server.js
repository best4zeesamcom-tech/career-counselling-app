require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');

// Import passport config
require('./config/passport');

console.log("🔍 ENV CHECK:", {
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID ? "✅ FOUND" : "❌ MISSING",
  FACEBOOK_APP_ID: process.env.FACEBOOK_APP_ID ? "✅ FOUND" : "❌ MISSING",
  BACKEND_URL: process.env.BACKEND_URL || "http://localhost:5000"
});

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

// Session middleware
app.use(session({
  secret: process.env.SESSION_SECRET || 'secret_key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    maxAge: 24 * 60 * 60 * 1000
  }
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Static files
app.use('/uploads', express.static('uploads'));

// ========== ROUTES ==========
app.use('/api/auth', authRoutes);
console.log("🔗 Auth routes mounted at /api/auth");

app.use('/api/careers', careerRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/payment', paymentRoutes);

// ========== DEBUG ROUTE - Add this to see all registered routes ==========
app.get('/debug-routes', (req, res) => {
  const routes = [];
  
  app._router.stack.forEach((middleware) => {
    if (middleware.route) {
      // Routes registered directly on app
      routes.push({
        path: middleware.route.path,
        methods: Object.keys(middleware.route.methods)
      });
    } else if (middleware.name === 'router') {
      // Routes registered as routers
      middleware.handle.stack.forEach((handler) => {
        if (handler.route) {
          routes.push({
            path: handler.route.path,
            methods: Object.keys(handler.route.methods)
          });
        }
      });
    }
  });
  
  res.json({
    totalRoutes: routes.length,
    routes: routes,
    authRoutesExist: routes.some(r => r.path.includes('/auth/google'))
  });
});

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

// ========== MONGODB CONNECTION ==========
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

// ========== ERROR HANDLERS (MUST BE LAST) ==========
app.use((req, res) => {
    console.log(`❌ 404: ${req.method} ${req.url}`);
    res.status(404).json({ 
        message: 'Route not found',
        requestedUrl: req.url,
        availableEndpoints: ['/', '/health', '/api/auth', '/api/careers', '/api/jobs', '/debug-routes']
    });
});

app.use((err, req, res, next) => {
    console.error('❌ Error:', err.stack);
    res.status(500).json({ 
        message: 'Something went wrong!',
        error: err.message 
    });
});

// ========== START SERVER ==========
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`\n🚀 Server running on port ${PORT}`);
    console.log(`📡 API URL: http://localhost:${PORT}`);
    console.log(`❤️  Health check: http://localhost:${PORT}/health`);
    console.log(`🔍 Debug routes: http://localhost:${PORT}/debug-routes`);
    console.log(`📋 Jobs API: http://localhost:${PORT}/api/jobs`);
    console.log(`🎓 Careers API: http://localhost:${PORT}/api/careers\n`);
});