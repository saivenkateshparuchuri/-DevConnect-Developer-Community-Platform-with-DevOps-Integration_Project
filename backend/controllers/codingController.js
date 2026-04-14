const vm = require("vm");
const util = require("util");
const CodingProblem = require("../models/CodingProblem");
const CodingSubmission = require("../models/CodingSubmission");
const User = require("../models/User");
const Admin = require("../models/Admin");
const { trackUserStreakActivity } = require("../utils/streakActivity");

const SUPPORTED_LANGUAGES = ["javascript", "python", "java", "cpp"];

const slugify = (value = "") =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

const parseStringArray = (value) => {
  if (Array.isArray(value)) return value.map((item) => String(item).trim()).filter(Boolean);
  if (typeof value === "string") {
    return value
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return [];
};

const parseExamples = (examples) => {
  if (!Array.isArray(examples)) return [];
  return examples
    .map((example) => ({
      input: String(example.input || "").trim(),
      output: String(example.output || "").trim(),
      explanation: String(example.explanation || "").trim()
    }))
    .filter((example) => example.input && example.output);
};

const parseTests = (tests) => {
  if (!Array.isArray(tests)) return [];
  return tests
    .map((test) => ({ args: test.args, expected: test.expected }))
    .filter((test) => typeof test.args !== "undefined" && typeof test.expected !== "undefined");
};

const normalizeProblemPayload = (payload) => {
  const starterCode = payload.starterCode || {};

  return {
    title: String(payload.title || "").trim(),
    slug: String(payload.slug || "").trim(),
    description: String(payload.description || "").trim(),
    difficulty: ["Easy", "Medium", "Hard"].includes(payload.difficulty) ? payload.difficulty : "Easy",
    tags: parseStringArray(payload.tags),
    constraints: parseStringArray(payload.constraints),
    examples: parseExamples(payload.examples),
    functionName: String(payload.functionName || "solve").trim() || "solve",
    starterCode: {
      javascript: String(starterCode.javascript || "function solve() {\n  // write code here\n}\n"),
      python: String(starterCode.python || "def solve():\n    # write code here\n    pass\n"),
      java: String(
        starterCode.java ||
          "class Solution {\n    public static Object solve() {\n        // write code here\n        return null;\n    }\n}\n"
      ),
      cpp: String(starterCode.cpp || "#include <bits/stdc++.h>\nusing namespace std;\n\n// write solve() here\n")
    },
    tests: parseTests(payload.tests),
    points: Number.isFinite(Number(payload.points)) ? Math.max(0, Number(payload.points)) : 10,
    isActive: payload.isActive !== false
  };
};

const runJavaScriptSubmission = ({ code, functionName, tests }) => {
  const context = vm.createContext({});
  const wrapped = `${code}\n;globalThis.__solve__ = typeof ${functionName} === "function" ? ${functionName} : null;`;

  try {
    const script = new vm.Script(wrapped);
    script.runInContext(context, { timeout: 1200 });
  } catch (err) {
    return {
      status: "Rejected",
      passedTests: 0,
      totalTests: tests.length,
      resultSummary: `Syntax error: ${err.message}`,
      testResults: []
    };
  }

  const solveFn = context.__solve__;
  if (typeof solveFn !== "function") {
    return {
      status: "Rejected",
      passedTests: 0,
      totalTests: tests.length,
      resultSummary: `Function ${functionName}(...) not found`,
      testResults: []
    };
  }

  const testResults = [];

  for (let i = 0; i < tests.length; i += 1) {
    const test = tests[i];
    const args = Array.isArray(test.args) ? test.args : [test.args];

    try {
      const actual = solveFn(...args);
      const passed = util.isDeepStrictEqual(actual, test.expected);
      testResults.push({
        index: i + 1,
        passed,
        input: test.args,
        expected: test.expected,
        actual
      });
    } catch (err) {
      testResults.push({
        index: i + 1,
        passed: false,
        input: test.args,
        expected: test.expected,
        actual: `Runtime error: ${err.message}`
      });
    }
  }

  const passedTests = testResults.filter((test) => test.passed).length;
  const status = passedTests === tests.length ? "Accepted" : "Rejected";

  return {
    status,
    passedTests,
    totalTests: tests.length,
    resultSummary:
      status === "Accepted"
        ? `Passed all ${tests.length} test cases`
        : `Passed ${passedTests}/${tests.length} test cases`,
    testResults
  };
};

const hasAcceptedForProblem = async (userId, problemId, excludeSubmissionId = null) => {
  const query = {
    user: userId,
    problem: problemId,
    status: "Accepted"
  };

  if (excludeSubmissionId) {
    query._id = { $ne: excludeSubmissionId };
  }

  const existing = await CodingSubmission.findOne(query).select("_id");
  return Boolean(existing);
};

const getActorModel = async (userId) => {
  const admin = await Admin.findById(userId).select("_id");
  if (admin) return "Admin";
  return "User";
};

const getCodingProblems = async (req, res) => {
  try {
    const problems = await CodingProblem.find({ isActive: true })
      .select("title slug difficulty tags points createdAt updatedAt")
      .sort({ createdAt: -1 });

    res.json(problems);
  } catch (err) {
    res.status(500).json({ message: "Error fetching coding problems" });
  }
};

const getCodingProblemById = async (req, res) => {
  try {
    const problem = await CodingProblem.findById(req.params.id);
    if (!problem || !problem.isActive) {
      return res.status(404).json({ message: "Coding problem not found" });
    }

    res.json(problem);
  } catch (err) {
    res.status(500).json({ message: "Error fetching coding problem" });
  }
};

const createCodingProblem = async (req, res) => {
  try {
    const normalized = normalizeProblemPayload(req.body);
    if (!normalized.title || !normalized.description) {
      return res.status(400).json({ message: "Title and description are required" });
    }

    if (normalized.tests.length === 0) {
      return res.status(400).json({ message: "At least one hidden test is required" });
    }

    normalized.slug = normalized.slug || slugify(normalized.title);
    const existing = await CodingProblem.findOne({ slug: normalized.slug }).select("_id");
    if (existing) {
      return res.status(409).json({ message: "Problem slug already exists" });
    }

    normalized.createdBy = req.user.id;
    normalized.createdByModel = await getActorModel(req.user.id);

    const created = await CodingProblem.create(normalized);
    res.status(201).json(created);
  } catch (err) {
    res.status(500).json({ message: "Error creating coding problem" });
  }
};

const updateCodingProblem = async (req, res) => {
  try {
    const normalized = normalizeProblemPayload(req.body);
    if (!normalized.title || !normalized.description) {
      return res.status(400).json({ message: "Title and description are required" });
    }

    if (normalized.tests.length === 0) {
      return res.status(400).json({ message: "At least one hidden test is required" });
    }

    normalized.slug = normalized.slug || slugify(normalized.title);

    const duplicate = await CodingProblem.findOne({
      slug: normalized.slug,
      _id: { $ne: req.params.id }
    }).select("_id");

    if (duplicate) {
      return res.status(409).json({ message: "Problem slug already exists" });
    }

    const updated = await CodingProblem.findByIdAndUpdate(req.params.id, normalized, {
      new: true,
      runValidators: true
    });

    if (!updated) {
      return res.status(404).json({ message: "Coding problem not found" });
    }

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Error updating coding problem" });
  }
};

const deleteCodingProblem = async (req, res) => {
  try {
    const deleted = await CodingProblem.findByIdAndDelete(req.params.id).select("_id title");
    if (!deleted) {
      return res.status(404).json({ message: "Coding problem not found" });
    }

    await CodingSubmission.deleteMany({ problem: req.params.id });

    res.json({
      message: "Coding problem deleted",
      deleted: {
        id: deleted._id,
        title: deleted.title
      }
    });
  } catch (err) {
    res.status(500).json({ message: "Error deleting coding problem" });
  }
};

const submitCodingSolution = async (req, res) => {
  try {
    const { language, code } = req.body;

    if (!SUPPORTED_LANGUAGES.includes(language)) {
      return res.status(400).json({ message: "Unsupported language" });
    }

    if (!code || !String(code).trim()) {
      return res.status(400).json({ message: "Code is required" });
    }

    const problem = await CodingProblem.findById(req.params.id);
    if (!problem || !problem.isActive) {
      return res.status(404).json({ message: "Coding problem not found" });
    }

    let evaluation = {
      status: "Pending",
      passedTests: 0,
      totalTests: problem.tests.length,
      resultSummary: "Submitted for manual review",
      testResults: []
    };

    if (language === "javascript") {
      evaluation = runJavaScriptSubmission({
        code: String(code),
        functionName: problem.functionName,
        tests: problem.tests
      });
    }

    const alreadyAccepted =
      evaluation.status === "Accepted"
        ? await hasAcceptedForProblem(req.user.id, problem._id)
        : true;

    const awarded = evaluation.status === "Accepted" && !alreadyAccepted ? problem.points : 0;

    const submission = await CodingSubmission.create({
      user: req.user.id,
      problem: problem._id,
      language,
      code: String(code),
      status: evaluation.status,
      passedTests: evaluation.passedTests,
      totalTests: evaluation.totalTests,
      scoreAwarded: awarded,
      resultSummary: evaluation.resultSummary,
      testResults: evaluation.testResults
    });

    if (awarded > 0) {
      await User.findByIdAndUpdate(req.user.id, {
        $inc: {
          codingScore: awarded,
          codingSolvedCount: 1
        }
      });
    }

    await trackUserStreakActivity(req.user.id);

    res.status(201).json({
      message: "Submission saved",
      submission
    });
  } catch (err) {
    res.status(500).json({ message: "Error submitting solution" });
  }
};

const getMyCodingSubmissions = async (req, res) => {
  try {
    const submissions = await CodingSubmission.find({ user: req.user.id })
      .populate("problem", "title difficulty points")
      .sort({ createdAt: -1 });

    res.json(submissions);
  } catch (err) {
    res.status(500).json({ message: "Error fetching your coding submissions" });
  }
};

const getMyCodingStats = async (req, res) => {
  try {
    const [totalSubmissions, acceptedSubmissions, pendingSubmissions, solvedProblems, user] = await Promise.all([
      CodingSubmission.countDocuments({ user: req.user.id }),
      CodingSubmission.countDocuments({ user: req.user.id, status: "Accepted" }),
      CodingSubmission.countDocuments({ user: req.user.id, status: "Pending" }),
      CodingSubmission.distinct("problem", { user: req.user.id, status: "Accepted" }),
      User.findById(req.user.id).select("codingScore codingSolvedCount")
    ]);

    res.json({
      totalSubmissions,
      acceptedSubmissions,
      pendingSubmissions,
      solvedProblems: solvedProblems.length,
      codingScore: user?.codingScore || 0,
      codingSolvedCount: user?.codingSolvedCount || 0
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching coding stats" });
  }
};

const getAllCodingSubmissionsForAdmin = async (req, res) => {
  try {
    const submissions = await CodingSubmission.find()
      .populate("user", "name email")
      .populate("problem", "title difficulty points")
      .populate("reviewedBy", "name email")
      .sort({ createdAt: -1 });

    res.json(submissions);
  } catch (err) {
    res.status(500).json({ message: "Error fetching coding submissions" });
  }
};

const reviewCodingSubmission = async (req, res) => {
  try {
    const { status, feedback, scoreAwarded } = req.body;
    if (!["Accepted", "Rejected", "Pending"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const submission = await CodingSubmission.findById(req.params.id).populate("problem", "points");
    if (!submission) {
      return res.status(404).json({ message: "Submission not found" });
    }

    const actorModel = await getActorModel(req.user.id);
    const previousStatus = submission.status;

    submission.status = status;
    submission.feedback = String(feedback || "");
    submission.reviewedBy = req.user.id;
    submission.reviewedByModel = actorModel;
    submission.reviewedAt = new Date();

    if (status === "Accepted") {
      const hasAlreadyAccepted = await hasAcceptedForProblem(
        submission.user,
        submission.problem._id,
        submission._id
      );

      const desiredScore = Number.isFinite(Number(scoreAwarded))
        ? Math.max(0, Number(scoreAwarded))
        : submission.problem.points;

      submission.scoreAwarded = !hasAlreadyAccepted ? desiredScore : 0;

      if (!hasAlreadyAccepted && submission.scoreAwarded > 0) {
        await User.findByIdAndUpdate(submission.user, {
          $inc: {
            codingScore: submission.scoreAwarded,
            codingSolvedCount: previousStatus === "Accepted" ? 0 : 1
          }
        });
      }
    } else if (status === "Rejected") {
      submission.scoreAwarded = 0;
    }

    await submission.save();

    res.json({ message: "Submission reviewed", submission });
  } catch (err) {
    res.status(500).json({ message: "Error reviewing coding submission" });
  }
};

module.exports = {
  getCodingProblems,
  getCodingProblemById,
  createCodingProblem,
  updateCodingProblem,
  deleteCodingProblem,
  submitCodingSolution,
  getMyCodingSubmissions,
  getMyCodingStats,
  getAllCodingSubmissionsForAdmin,
  reviewCodingSubmission
};
