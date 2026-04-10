const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const { updateProfile, getUserProfile, getTopUsers, getAllUsers, deleteUser } = require("../controllers/userController");

// Admin routes
router.delete("/:id", authMiddleware, adminMiddleware, deleteUser);

// Public/User routes
router.get("/all", authMiddleware, getAllUsers);
router.put("/update", authMiddleware, updateProfile);
router.get("/top", getTopUsers); // Add /top BEFORE /:id to avoid route collision
router.get("/:id", getUserProfile);

module.exports = router;