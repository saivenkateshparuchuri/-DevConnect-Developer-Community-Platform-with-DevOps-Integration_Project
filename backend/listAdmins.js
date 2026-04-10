require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('./models/Admin');
const connectDB = require('./config/db');

const listAdmins = async () => {
    try {
        await connectDB();
        const admins = await Admin.find({});
        console.log('Admins in database:', admins.map(a => a.email));
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

listAdmins();
