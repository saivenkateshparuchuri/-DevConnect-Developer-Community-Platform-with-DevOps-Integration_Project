require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Admin = require('./models/Admin');
const connectDB = require('./config/db');

const seedAdmin = async () => {
  try {
    await connectDB();

    const existingAdmin = await Admin.findOne({ email: 'admin@example.com' });
    if (existingAdmin) {
      console.log('Admin already exists.');
      process.exit();
    }

    const hashedPassword = await bcrypt.hash('admin123', 10);

    const admin = new Admin({
      name: 'Super Admin',
      email: 'admin@example.com',
      password: hashedPassword,
      role: 'Super Admin'
    });

    await admin.save();
    console.log('Super Admin created successfully (admin@example.com / admin123)');
    process.exit();
  } catch (error) {
    console.error('Error creating admin:', error);
    process.exit(1);
  }
};

seedAdmin();
