require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Admin = require('./models/Admin');
const connectDB = require('./config/db');

const seedAdmin = async () => {
  try {
    await connectDB();

    const hashedPassword = await bcrypt.hash('Sai@2004', 10);

    const adminData = {
      name: 'Sai Venkatesh Paruchuri',
      email: 'saivenkateshparuchuri2004@gmail.com',
      password: hashedPassword,
      role: 'Admin'
    };

    const existingAdmin = await Admin.findOneAndUpdate(
      { email: 'saivenkateshparuchuri2004@gmail.com' },
      adminData,
      { upsert: true, new: true }
    );

    console.log('Admin created/updated successfully (saivenkateshparuchuri2004@gmail.com / Sai@2004)');
    process.exit();
  } catch (error) {
    console.error('Error creating/updating admin:', error);
    process.exit(1);
  }
};

seedAdmin();
