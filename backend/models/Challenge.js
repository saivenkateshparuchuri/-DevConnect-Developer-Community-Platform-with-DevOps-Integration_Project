const mongoose = require('mongoose');

const challengeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  level: {
    type: String,
    required: true,
    enum: ['Easy', 'Medium', 'Hard']
  },
  points: {
    type: Number,
    required: true
  },
  tech: {
    type: [String],
    required: true
  },
  deadline: {
    type: String,
    required: true
  },
  color: {
    type: String,
    default: 'primary'
  },
  category: {
    type: String,
    required: true,
    enum: ['Frontend', 'Backend', 'AI', 'Practice']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Challenge', challengeSchema);
