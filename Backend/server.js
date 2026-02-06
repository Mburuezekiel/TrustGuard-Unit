const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

// Import routes
const authRoutes = require('./src/routes/auth.routes');
const analyzeRoutes = require('./src/routes/analyze.routes');
const reportRoutes = require('./src/routes/report.routes');
const trustcardRoutes = require('./src/routes/trustcard.routes');
const blockchainRoutes = require('./src/routes/blockchain.routes');
 const paymentRoutes = require('./src/routes/payment.routes');
 const supportRoutes = require('./src/routes/support.routes');
 const blogRoutes = require('./src/routes/blog.routes');
 const businessRoutes = require('./src/routes/business.routes');
 const chatRoutes = require('./src/routes/chat.routes');

// Import middleware
const errorHandler = require('./src/middleware/errorHandler');

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:8080', 'https://m-pesa-shield-1.onrender.com'],
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: { error: 'Too many requests, please try again later.' }
});
app.use('/api/', limiter);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.API_VERSION || 'v1'
  });
});

// API routes
const apiVersion = process.env.API_VERSION || 'v1';
app.use(`/api/${apiVersion}/auth`, authRoutes);
app.use(`/api/${apiVersion}/analyze`, analyzeRoutes);
app.use(`/api/${apiVersion}/reports`, reportRoutes);
app.use(`/api/${apiVersion}/trustcard`, trustcardRoutes);
app.use(`/api/${apiVersion}/blockchain`, blockchainRoutes);
 app.use(`/api/${apiVersion}/payments`, paymentRoutes);
 app.use(`/api/${apiVersion}/support`, supportRoutes);
 app.use(`/api/${apiVersion}/blog`, blogRoutes);
 app.use(`/api/${apiVersion}/business`, businessRoutes);
 app.use(`/api/${apiVersion}/chat`, chatRoutes);

// Error handling
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Database connection and server start
const PORT = process.env.PORT || 5000;

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      process.env.NODE_ENV === 'production' 
        ? process.env.MONGODB_URI_PROD 
        : process.env.MONGODB_URI,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
  }
};

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`ScamAlert Backend running on port ${PORT}`);
    console.log(`API Version: ${apiVersion}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  });
});

module.exports = app;
