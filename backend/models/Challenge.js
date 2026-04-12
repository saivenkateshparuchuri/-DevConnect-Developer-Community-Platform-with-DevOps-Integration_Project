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
  problemStatement: {
    type: String,
    default: ''
  },
  constraints: {
    type: [String],
    default: []
  },
  starterCode: {
    type: String,
    default: ''
  },
  expectedApproach: {
    type: String,
    default: ''
  },
  submissions: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
      language: {
        type: String,
        default: 'javascript'
      },
      code: {
        type: String,
        required: true
      },
      status: {
        type: String,
        enum: ['Pending', 'Accepted', 'Rejected'],
        default: 'Pending'
      },
      feedback: {
        type: String,
        default: ''
      },
      submittedAt: {
        type: Date,
        default: Date.now
      },
      reviewedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin',
        default: null
      },
      reviewedAt: {
        type: Date,
        default: null
      }
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Challenge', challengeSchema);
