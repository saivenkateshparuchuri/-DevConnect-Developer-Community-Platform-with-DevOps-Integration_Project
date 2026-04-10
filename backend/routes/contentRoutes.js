const express = require("express");
const router = express.Router();
const { getAllArticles, getAllChallenges } = require("../controllers/contentController");

// Use just /all since the prefix will be in server.js
router.get("/all", (req, res, next) => {
  // Determine if this is articles or challenges based on path
  if (req.originalUrl.includes("/articles")) {
    return getAllArticles(req, res, next);
  } else if (req.originalUrl.includes("/challenges")) {
    return getAllChallenges(req, res, next);
  }
  next();
});

module.exports = router;
