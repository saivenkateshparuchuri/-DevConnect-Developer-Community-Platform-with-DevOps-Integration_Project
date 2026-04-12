const Challenge = require("../models/Challenge");
const User = require("../models/User");

const getAllChallenges = async (req, res) => {
  try {
    const challenges = await Challenge.find().sort({ createdAt: -1 });
    res.json(challenges);
  } catch (err) {
    res.status(500).json({ message: "Error fetching challenges" });
  }
};

const getChallengeById = async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id)
      .populate("submissions.user", "name email")
      .populate("submissions.reviewedBy", "name email");

    if (!challenge) {
      return res.status(404).json({ message: "Challenge not found" });
    }

    res.json(challenge);
  } catch (err) {
    res.status(500).json({ message: "Error fetching challenge" });
  }
};

const createChallenge = async (req, res) => {
  try {
    const {
      title,
      level,
      points,
      tech,
      deadline,
      color,
      category,
      problemStatement,
      constraints,
      starterCode,
      expectedApproach
    } = req.body;

    if (!title || !problemStatement) {
      return res.status(400).json({ message: "Title and problem statement are required" });
    }

    const normalizedTech = Array.isArray(tech)
      ? tech
      : typeof tech === "string"
      ? tech.split(",").map((t) => t.trim()).filter(Boolean)
      : [];

    const normalizedConstraints = Array.isArray(constraints)
      ? constraints
      : typeof constraints === "string"
      ? constraints.split("\n").map((c) => c.trim()).filter(Boolean)
      : [];

    const challenge = await Challenge.create({
      title,
      level: level || "Easy",
      points: Number(points) || 50,
      tech: normalizedTech.length ? normalizedTech : ["javascript"],
      deadline: deadline || "No deadline",
      color: color || "primary",
      category: category || "Practice",
      problemStatement,
      constraints: normalizedConstraints,
      starterCode: starterCode || "",
      expectedApproach: expectedApproach || ""
    });

    res.status(201).json(challenge);
  } catch (err) {
    res.status(500).json({ message: "Error creating challenge" });
  }
};

const submitChallengeSolution = async (req, res) => {
  try {
    const { language, code } = req.body;

    if (!code || !code.trim()) {
      return res.status(400).json({ message: "Solution code is required" });
    }

    const challenge = await Challenge.findById(req.params.id);
    if (!challenge) {
      return res.status(404).json({ message: "Challenge not found" });
    }

    challenge.submissions.push({
      user: req.user.id,
      language: language || "javascript",
      code: code.trim(),
      status: "Pending"
    });

    await challenge.save();

    await User.findByIdAndUpdate(req.user.id, { $set: { lastActivityAt: new Date() } });

    const submission = challenge.submissions[challenge.submissions.length - 1];
    res.status(201).json({ message: "Solution submitted successfully", submission });
  } catch (err) {
    res.status(500).json({ message: "Error submitting solution" });
  }
};

const getMySubmissions = async (req, res) => {
  try {
    const challenges = await Challenge.find({ "submissions.user": req.user.id }).select(
      "title level points category submissions"
    );

    const records = [];

    challenges.forEach((challenge) => {
      challenge.submissions.forEach((submission) => {
        if (String(submission.user) === String(req.user.id)) {
          records.push({
            challengeId: challenge._id,
            challengeTitle: challenge.title,
            level: challenge.level,
            points: challenge.points,
            category: challenge.category,
            submissionId: submission._id,
            language: submission.language,
            status: submission.status,
            feedback: submission.feedback,
            submittedAt: submission.submittedAt
          });
        }
      });
    });

    records.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: "Error fetching submissions" });
  }
};

const getAllSubmissionsForAdmin = async (req, res) => {
  try {
    const challenges = await Challenge.find({ "submissions.0": { $exists: true } })
      .select("title level points category submissions")
      .populate("submissions.user", "name email")
      .populate("submissions.reviewedBy", "name email")
      .sort({ createdAt: -1 });

    const records = [];

    challenges.forEach((challenge) => {
      challenge.submissions.forEach((submission) => {
        records.push({
          challengeId: challenge._id,
          challengeTitle: challenge.title,
          level: challenge.level,
          points: challenge.points,
          category: challenge.category,
          submissionId: submission._id,
          user: submission.user,
          language: submission.language,
          code: submission.code,
          status: submission.status,
          feedback: submission.feedback,
          reviewedBy: submission.reviewedBy,
          reviewedAt: submission.reviewedAt,
          submittedAt: submission.submittedAt
        });
      });
    });

    records.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: "Error fetching all submissions" });
  }
};

const reviewSubmission = async (req, res) => {
  try {
    const { challengeId, submissionId } = req.params;
    const { status, feedback } = req.body;

    if (!["Accepted", "Rejected"].includes(status)) {
      return res.status(400).json({ message: "Status must be Accepted or Rejected" });
    }

    const challenge = await Challenge.findById(challengeId);
    if (!challenge) {
      return res.status(404).json({ message: "Challenge not found" });
    }

    const submission = challenge.submissions.id(submissionId);
    if (!submission) {
      return res.status(404).json({ message: "Submission not found" });
    }

    submission.status = status;
    submission.feedback = feedback || "";
    submission.reviewedBy = req.user.id;
    submission.reviewedAt = new Date();

    await challenge.save();

    res.json({ message: "Submission reviewed", submission });
  } catch (err) {
    res.status(500).json({ message: "Error reviewing submission" });
  }
};

module.exports = {
  getAllChallenges,
  getChallengeById,
  createChallenge,
  submitChallengeSolution,
  getMySubmissions,
  getAllSubmissionsForAdmin,
  reviewSubmission
};
