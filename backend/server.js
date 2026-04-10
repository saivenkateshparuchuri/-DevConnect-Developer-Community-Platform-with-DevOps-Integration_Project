const express = require('express');
const cors = require('cors');
require('dotenv').config();
const userRoutes = require("./routes/userRoutes");



const connectDB = require('./config/db');

const app = express();

// ✅ middleware FIRST
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5000',
  'https://developer-community-project-2-la7x.vercel.app'
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

const authMiddleware = require('./middleware/authMiddleware');

// database connection
connectDB();

// test route
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

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on the port ${PORT}`);
});