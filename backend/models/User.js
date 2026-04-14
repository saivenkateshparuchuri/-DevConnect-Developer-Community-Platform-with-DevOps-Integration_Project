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
  photoUrl: {
    type: String,
    default: ""
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
  },
  lastActivityAt: {
    type: Date,
    default: Date.now
  },
  streakCount: {
    type: Number,
    default: 0
  },
  lastStreakDate: {
    type: Date,
    default: null
  },
  codingScore: {
    type: Number,
    default: 0
  },
  codingSolvedCount: {
    type: Number,
    default: 0
  }
});

module.exports = mongoose.model('User', userSchema);