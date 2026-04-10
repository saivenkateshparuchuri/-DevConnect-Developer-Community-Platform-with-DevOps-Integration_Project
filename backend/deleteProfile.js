require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const connectDB = require('./config/db');

const deleteTarget = async () => {
    try {
        await connectDB();
        const res = await User.deleteOne({ email: 'admin@dev.com' });
        console.log('Delete result for admin@dev.com:', res);
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

deleteTarget();
