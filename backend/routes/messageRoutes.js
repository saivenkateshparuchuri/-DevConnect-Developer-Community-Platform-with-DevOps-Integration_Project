const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { getMessages, sendMessage, getConversations } = require('../controllers/messageController');

// IMPORTANT: /conversations must be BEFORE /:userId to avoid route conflict
router.get('/conversations', authMiddleware, getConversations);
router.get('/:userId', authMiddleware, getMessages);
router.post('/', authMiddleware, sendMessage);

module.exports = router;
