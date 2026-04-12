const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const { askAI } = require('../controllers/aiController');

const router = express.Router();

router.post('/chat', authMiddleware, askAI);

module.exports = router;
