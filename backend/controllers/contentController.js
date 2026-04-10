const Article = require("../models/Article");
const Challenge = require("../models/Challenge");

// Articles
const getAllArticles = async (req, res) => {
  try {
    const articles = await Article.find().sort({ createdAt: -1 });
    res.json(articles);
  } catch (err) {
    res.status(500).json({ message: "Error fetching articles" });
  }
};

// Challenges
const getAllChallenges = async (req, res) => {
  try {
    const challenges = await Challenge.find().sort({ createdAt: -1 });
    res.json(challenges);
  } catch (err) {
    res.status(500).json({ message: "Error fetching challenges" });
  }
};

module.exports = {
  getAllArticles,
  getAllChallenges
};
