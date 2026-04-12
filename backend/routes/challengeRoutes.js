const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const {
	getAllChallenges,
	getChallengeById,
	createChallenge,
	submitChallengeSolution,
	getMySubmissions,
	getAllSubmissionsForAdmin,
	reviewSubmission
} = require("../controllers/challengeController");

router.get("/all", getAllChallenges);
router.get("/my/submissions", authMiddleware, getMySubmissions);
router.get("/submissions/all", authMiddleware, adminMiddleware, getAllSubmissionsForAdmin);
router.get("/:id", getChallengeById);
router.post("/", authMiddleware, adminMiddleware, createChallenge);
router.post("/:id/submit", authMiddleware, submitChallengeSolution);
router.patch("/:challengeId/submissions/:submissionId/review", authMiddleware, adminMiddleware, reviewSubmission);

module.exports = router;
