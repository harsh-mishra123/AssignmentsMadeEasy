const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const http = require('http'); // ⬅️ Added
const connectDB = require('./config/db');
// ⬅️ Added (we’ll create this file next)

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Initialize Express app
const app = express();

// Security headers
app.use(helmet());

// Rate limiting (more permissive for development)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // limit each IP to 1000 requests per window (increased for dev)
  message: 'Too many requests from this IP, try again later',
});
app.use(limiter);

// CORS configuration
const corsOptions = {
  origin: ['http://localhost:5173', 'http://localhost:3000', 'http://localhost:5174'],
  credentials: true,
  optionsSuccessStatus: 200,
};

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions));

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
const userRoutes = require('./routes/userRoutes.js');
const studentRoutes = require('./routes/studentRoutes.js');
const adminRoutes = require('./routes/adminRoutes.js');
const assignmentRoutes = require('./routes/assignmentRoutes.js');
const submissionRoutes = require('./routes/submissionRoutes.js');
const notificationRoutes = require('./routes/notificationRoutes.js');
const { errorHandler } = require('./middleware/errorMiddleware');



// Mount routes
app.use('/api/users', userRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/submissions', submissionRoutes);
app.use('/api/notifications', notificationRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('🚀 API is running');
});

// Health check route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    cors: 'enabled',
  });
});

// 404 handler
app.use((req, res, next) => {
  res.status(404);
  next(new Error(`Not Found - ${req.originalUrl}`));
});

// Global error handler
app.use(errorHandler);

// Create HTTP server
const server = http.createServer(app);

// Start server
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
