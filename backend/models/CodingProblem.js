const mongoose = require("mongoose");

const codingExampleSchema = new mongoose.Schema(
  {
    input: { type: String, required: true },
    output: { type: String, required: true },
    explanation: { type: String, default: "" }
  },
  { _id: false }
);

const codingTestSchema = new mongoose.Schema(
  {
    args: { type: mongoose.Schema.Types.Mixed, required: true },
    expected: { type: mongoose.Schema.Types.Mixed, required: true }
  },
  { _id: false }
);

const codingProblemSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true },
    description: { type: String, required: true, trim: true },
    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      default: "Easy"
    },
    tags: { type: [String], default: [] },
    constraints: { type: [String], default: [] },
    examples: { type: [codingExampleSchema], default: [] },
    functionName: { type: String, default: "solve" },
    starterCode: {
      javascript: {
        type: String,
        default: "function solve() {\n  // write code here\n}\n"
      },
      python: {
        type: String,
        default: "def solve():\n    # write code here\n    pass\n"
      },
      java: {
        type: String,
        default:
          "class Solution {\n    public static Object solve() {\n        // write code here\n        return null;\n    }\n}\n"
      },
      cpp: {
        type: String,
        default:
          "#include <bits/stdc++.h>\nusing namespace std;\n\n// write solve() here\n"
      }
    },
    tests: { type: [codingTestSchema], default: [] },
    points: { type: Number, default: 10, min: 0 },
    isActive: { type: Boolean, default: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, refPath: "createdByModel" },
    createdByModel: { type: String, enum: ["User", "Admin"], default: "User" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("CodingProblem", codingProblemSchema);
