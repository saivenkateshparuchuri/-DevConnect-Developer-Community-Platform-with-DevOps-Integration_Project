const Admin = require('../models/Admin');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // find admin
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(400).json({ message: 'Admin not found' });
    }

    // compare password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // create token
    const adminToken = jwt.sign(
      { id: admin._id, role: 'admin', isAdmin: true },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({ adminToken });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getMe = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin.id).select('-password');
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }
    // Return as 'user' with isAdmin flag for frontend compatibility
    const adminObj = admin.toObject();
    adminObj.isAdmin = true;
    res.json({ user: adminObj });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// We probably shouldn't have a public signup for admins, but for seeding or another admin creating one:
exports.createAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if another admin already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: 'Admin already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = new Admin({
      name,
      email,
      password: hashedPassword
    });

    await admin.save();
    res.status(201).json({ message: 'Admin created successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const User = require('../models/User'); // Required to delete a standard user

exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    // ensure admin identity
    if(req.admin.role !== 'admin') {
       return res.status(403).json({ message: 'Forbidden' });
    }

    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User successfully deleted.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const Post = require('../models/Post');

exports.deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    // ensure admin identity
    if(req.admin.role !== 'admin') {
       return res.status(403).json({ message: 'Forbidden' });
    }

    const post = await Post.findByIdAndDelete(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.json({ message: 'Post successfully deleted.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
