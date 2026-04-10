require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('./models/Admin');
const User = require('./models/User');
const connectDB = require('./config/db');

const searchProfiles = async () => {
    try {
        await connectDB();
        const admins = await Admin.find({ $or: [{ name: /super/i }, { email: /admin/i }] });
        const users = await User.find({ $or: [{ name: /super/i }, { email: /admin/i }] });
        
        console.log('Admins found:', admins.map(a => ({ id: a._id, name: a.name, email: a.email })));
        console.log('Users found:', users.map(u => ({ id: u._id, name: u.name, email: u.email })));
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

searchProfiles();
