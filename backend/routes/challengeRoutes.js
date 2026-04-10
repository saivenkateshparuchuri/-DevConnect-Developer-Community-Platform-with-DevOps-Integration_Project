const express = require("express");
const router = express.Router();
const { getAllChallenges } = require("../controllers/contentController");

router.get("/all", getAllChallenges);

module.exports = router;
