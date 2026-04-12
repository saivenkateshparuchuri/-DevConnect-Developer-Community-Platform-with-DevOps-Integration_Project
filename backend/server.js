const express = require('express');
const cors = require('cors');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();
const userRoutes = require("./routes/userRoutes");



const connectDB = require('./config/db');

const app = express();
const server = http.createServer(app);

// ✅ middleware FIRST
const allowedOrigins = process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim()) : [
  'http://localhost:3000',
  'http://localhost:5000'
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true); // allow server-to-server, Postman, etc.
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error(`CORS policy: origin ${origin} not allowed`));
    }
  },
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the React app build directory
app.use(express.static(path.join(__dirname, './public')));

// ✅ THEN routes
const postRoutes = require('./routes/postRoutes');
app.use('/api/posts', postRoutes);

const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

app.use("/api/users", userRoutes);

const adminRoutes = require('./routes/adminRoutes');
app.use('/api/admin/auth', adminRoutes);

const articleRoutes = require("./routes/articleRoutes");
const challengeRoutes = require("./routes/challengeRoutes");

app.use("/api/articles", articleRoutes);
app.use("/api/challenges", challengeRoutes);

const messageRoutes = require("./routes/messageRoutes");
app.use("/api/messages", messageRoutes);

const aiRoutes = require("./routes/aiRoutes");
app.use("/api/ai", aiRoutes);

const authMiddleware = require('./middleware/authMiddleware');

// database connection
connectDB();


// Root route returns API status
app.get('/', (req, res) => {
  res.send('API is running');
});

app.get('/api/protected', authMiddleware, async (req, res) => {
  try {
    const isAdminAcc = req.user.role === 'admin' || req.user.isAdmin === true;
    
    if (isAdminAcc) {
      const admin = await require('./models/Admin').findById(req.user.id).select('-password');
      if (!admin) return res.status(404).json({ message: "Admin not found" });
      return res.json({ user: { ...admin.toObject(), isAdmin: true } });
    }
    
    const user = await require('./models/User').findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ user });
  } catch (err) {
    console.error("Protected route error:", err);
    res.status(500).json({ error: err.message });
  }
});

// Catch all handler: send back React's index.html file for client-side routing
app.get(/^\/(?!api)(.+)/, (req, res) => {
  res.sendFile(path.join(__dirname, './public/index.html'));
});

// global error handler for uncaught middleware errors
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({ error: 'Server error' });
});

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

const onlineUsers = new Map();

io.on('connection', (socket) => {
  console.log('Socket connected:', socket.id);

  socket.on('register_user', (userId) => {
    if (!userId) return;
    onlineUsers.set(userId, socket.id);
    console.log('Registered user', userId, '->', socket.id);
  });

  socket.on('disconnect', () => {
    for (const [userId, socketId] of onlineUsers.entries()) {
      if (socketId === socket.id) {
        onlineUsers.delete(userId);
        break;
      }
    }
  });

  socket.on('call_user', ({ targetUserId, callerId, callerName, offer }) => {
    const targetSocketId = onlineUsers.get(targetUserId);
    if (targetSocketId) {
      io.to(targetSocketId).emit('incoming_call', {
        from: callerId,
        callerName,
        offer,
      });
    } else {
      socket.emit('user_unavailable', { targetUserId });
    }
  });

  socket.on('answer_call', ({ targetUserId, answer }) => {
    const targetSocketId = onlineUsers.get(targetUserId);
    if (targetSocketId) {
      io.to(targetSocketId).emit('call_answered', { answer });
    }
  });

  socket.on('ice_candidate', ({ targetUserId, candidate }) => {
    const targetSocketId = onlineUsers.get(targetUserId);
    if (targetSocketId) {
      io.to(targetSocketId).emit('ice_candidate', { candidate });
    }
  });

  socket.on('end_call', ({ targetUserId }) => {
    const targetSocketId = onlineUsers.get(targetUserId);
    if (targetSocketId) {
      io.to(targetSocketId).emit('call_ended');
    }
  });
});

const PORT = parseInt(process.env.PORT, 10) || 5000;

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});