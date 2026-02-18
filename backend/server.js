const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const http = require('http');
const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Initialize Express app
const app = express();

// Seed initial admin (optional)
if (process.env.NODE_ENV !== 'production') {
  const seedAdmin = require('./utils/seedAdmin');
  seedAdmin();
}

// Security headers
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
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

// Create HTTP server
const server = http.createServer(app);

// ========== SOCKET.IO SETUP ==========
const io = new Server(server, {
  cors: {
    origin: ['http://localhost:5173', 'http://localhost:3000', 'http://localhost:5174'],
    credentials: true
  }
});

// Socket.io middleware for authentication
io.use((socket, next) => {
  const token = socket.handshake.auth.token?.split(' ')[1];
  if (!token) {
    return next(new Error('Authentication error'));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.userId = decoded.id;
    socket.userRole = decoded.role;
    next();
  } catch (err) {
    next(new Error('Authentication error'));
  }
});

// Socket.io connection handler
io.on('connection', (socket) => {
  console.log(`🔌 User connected: ${socket.userId} (${socket.userRole})`);

  // Join user to their personal room
  socket.join(`user:${socket.userId}`);
  
  // Join role-based room
  socket.join(`role:${socket.userRole}`);

  // Join all users room for broadcast announcements
  socket.join('all-users');

  socket.on('disconnect', () => {
    console.log(`🔌 User disconnected: ${socket.userId}`);
  });
});

// Make io accessible to routes
app.set('io', io);
// ========== END SOCKET.IO SETUP ==========

// Routes
const userRoutes = require('./routes/userRoutes.js');
const studentRoutes = require('./routes/studentRoutes.js');
const adminRoutes = require('./routes/adminRoutes.js');
const assignmentRoutes = require('./routes/assignmentRoutes.js');
const submissionRoutes = require('./routes/submissionRoutes.js');
const notificationRoutes = require('./routes/notificationRoutes.js');
const announcementRoutes = require('./routes/announcementRoutes');
const { errorHandler } = require('./middleware/errorMiddleware');

// Mount routes
app.use('/api/users', userRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/submissions', submissionRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/announcements', announcementRoutes);

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

// Start server
const PORT = process.env.PORT || 4040;
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`🔌 Socket.io server ready for real-time announcements`);
});