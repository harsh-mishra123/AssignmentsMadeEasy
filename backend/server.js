const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const cors = require('cors'); // ✅ Yeh rehne do
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const http = require('http');
const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();

// ✅ SAHI CORS - Bas itna kaafi hai
app.use(cors({
  origin: ['http://localhost:5173', 'https://assign-made-easy.netlify.app'],
  credentials: true
}));

// ❌ JO GALTI KI THI - yeh sab HATA DO
// app.use((req, res, next) => {
//   res.header('Access-Control-Allow-Origin', '*');   // YEH MAT DALO
//   ...

// Seed admin
if (process.env.NODE_ENV !== 'production') {
  const seedAdmin = require('./utils/seedAdmin');
  seedAdmin();
}

app.use(helmet());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 1000 }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const server = http.createServer(app);

// Socket.io CORS
const io = new Server(server, {
  cors: {
    origin: ['http://localhost:5173', 'https://assign-made-easy.netlify.app'],
    credentials: true
  }
});

io.use((socket, next) => {
  const token = socket.handshake.auth.token?.split(' ')[1];
  if (!token) return next(new Error('Authentication error'));
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.userId = decoded.id;
    socket.userRole = decoded.role;
    next();
  } catch (err) {
    next(new Error('Authentication error'));
  }
});

io.on('connection', (socket) => {
  console.log(`🔌 User connected: ${socket.userId}`);
  socket.join(`user:${socket.userId}`);
  socket.join(`role:${socket.userRole}`);
  socket.join('all-users');
  socket.on('disconnect', () => console.log(`🔌 User disconnected: ${socket.userId}`));
});

app.set('io', io);

// Routes
app.use('/api/users', require('./routes/userRoutes.js'));
app.use('/api/students', require('./routes/studentRoutes.js'));
app.use('/api/admin', require('./routes/adminRoutes.js'));
app.use('/api/assignments', require('./routes/assignmentRoutes.js'));
app.use('/api/submissions', require('./routes/submissionRoutes.js'));
app.use('/api/notifications', require('./routes/notificationRoutes.js'));
app.use('/api/announcements', require('./routes/announcementRoutes'));

app.get('/', (req, res) => res.send('🚀 API is running'));
app.get('/api/health', (req, res) => res.json({ status: 'OK' }));

// Error handlers
const { errorHandler } = require('./middleware/errorMiddleware');
app.use((req, res, next) => { res.status(404); next(new Error('Not Found')); });
app.use(errorHandler);

const PORT = process.env.PORT || 4040;
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});