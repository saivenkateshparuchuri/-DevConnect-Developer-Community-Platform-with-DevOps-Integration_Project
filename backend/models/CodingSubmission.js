const mongoose = require("mongoose");

const codingSubmissionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    problem: { type: mongoose.Schema.Types.ObjectId, ref: "CodingProblem", required: true },
    language: {
      type: String,
      enum: ["javascript", "python", "java", "cpp"],
      required: true
    },
    code: { type: String, required: true },
    status: {
      type: String,
      enum: ["Accepted", "Rejected", "Pending"],
      default: "Pending"
    },
    passedTests: { type: Number, default: 0, min: 0 },
    totalTests: { type: Number, default: 0, min: 0 },
    scoreAwarded: { type: Number, default: 0, min: 0 },
    resultSummary: { type: String, default: "" },
    testResults: { type: [mongoose.Schema.Types.Mixed], default: [] },
    feedback: { type: String, default: "" },
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, refPath: "reviewedByModel", default: null },
    reviewedByModel: { type: String, enum: ["User", "Admin"], default: null },
    reviewedAt: { type: Date, default: null }
  },
  { timestamps: true }
);

codingSubmissionSchema.index({ user: 1, createdAt: -1 });
codingSubmissionSchema.index({ problem: 1, createdAt: -1 });

module.exports = mongoose.model("CodingSubmission", codingSubmissionSchema);
