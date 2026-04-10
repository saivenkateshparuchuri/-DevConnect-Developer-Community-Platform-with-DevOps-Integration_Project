const express = require("express");
const router = express.Router();
const { getAllArticles } = require("../controllers/contentController");

router.get("/all", getAllArticles);

module.exports = router;
