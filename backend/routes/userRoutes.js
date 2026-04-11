const express = require("express");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const { updateProfile, getUserProfile, getTopUsers, getAllUsers, deleteUser } = require("../controllers/userController");

const uploadDir = path.join(__dirname, "../public/uploads");
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (req, file, cb) => {
    const safeName = file.originalname.replace(/\s+/g, "_");
    cb(null, `${Date.now()}-${safeName}`);
  }
});

const upload = multer({ storage });

// Admin routes
router.delete("/:id", authMiddleware, adminMiddleware, deleteUser);

// Public/User routes
router.get("/all", authMiddleware, getAllUsers);
router.put("/update", authMiddleware, upload.single("photo"), updateProfile);
router.get("/top", getTopUsers); // Add /top BEFORE /:id to avoid route collision
router.get("/:id", getUserProfile);

module.exports = router;