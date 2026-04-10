const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  gender: {
  type: String,
  enum: ["male", "female"],
  default: "male"
},
  bio: {
  type: String,
  default: "Hey! I am using Dev Community 🚀"
},
  isAdmin: {
    type: Boolean,
    default: false
  },
  skills: {
    type: [String],
    default: []
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', userSchema);