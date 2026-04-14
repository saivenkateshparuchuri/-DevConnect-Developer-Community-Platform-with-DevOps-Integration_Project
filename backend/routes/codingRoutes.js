const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const {
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
} = require("../controllers/codingController");

router.get("/problems", authMiddleware, getCodingProblems);
router.get("/problems/:id", authMiddleware, getCodingProblemById);
router.post("/problems", authMiddleware, adminMiddleware, createCodingProblem);
router.put("/problems/:id", authMiddleware, adminMiddleware, updateCodingProblem);
router.delete("/problems/:id", authMiddleware, adminMiddleware, deleteCodingProblem);

router.post("/problems/:id/submit", authMiddleware, submitCodingSolution);
router.get("/submissions/me", authMiddleware, getMyCodingSubmissions);
router.get("/stats/me", authMiddleware, getMyCodingStats);

router.get("/submissions", authMiddleware, adminMiddleware, getAllCodingSubmissionsForAdmin);
router.patch("/submissions/:id/review", authMiddleware, adminMiddleware, reviewCodingSubmission);

module.exports = router;
