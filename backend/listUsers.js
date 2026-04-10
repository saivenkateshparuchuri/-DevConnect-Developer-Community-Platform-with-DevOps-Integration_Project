const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');
const Admin = require('./models/Admin');

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    const users = await User.find({}, 'name email role');
    const admins = await Admin.find({}, 'name email role');
    
    console.log('--- ALL USERS IN DB ---');
    users.forEach(u => console.log(`User: ${u.name} (${u.email})`));
    admins.forEach(a => console.log(`Admin: ${a.name} (${a.email})`));
    
    process.exit();
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
