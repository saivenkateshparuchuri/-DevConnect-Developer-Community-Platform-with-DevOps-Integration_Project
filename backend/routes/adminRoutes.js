const express = require('express');
const router = express.Router();
const adminAuthController = require('../controllers/adminAuthController');
const adminAuthMiddleware = require('../middleware/adminAuthMiddleware');

// Public route for admin login
router.post('/login', adminAuthController.login);

// Keeping this public temporarily or could protect it using adminAuthMiddleware
router.post('/create', adminAuthController.createAdmin);

// Protected admin routes
router.get('/me', adminAuthMiddleware, adminAuthController.getMe);
router.delete('/users/:id', adminAuthMiddleware, adminAuthController.deleteUser);
router.delete('/posts/:id', adminAuthMiddleware, adminAuthController.deletePost);

module.exports = router;
