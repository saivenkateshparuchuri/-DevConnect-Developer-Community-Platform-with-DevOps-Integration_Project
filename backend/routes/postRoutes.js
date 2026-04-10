const express = require('express');
const router = express.Router();


const {
  createPost,
  getPosts,
  deletePost,
  updatePost,
  addAnswer, // ✅ ADD THIS
} = require("../controllers/postController");
const authMiddleware = require('../middleware/authMiddleware');


// CREATE POST
router.post('/', authMiddleware, createPost);

// GET ALL POSTS
router.get('/', getPosts);

// UPDATE POST 
router.put('/:id', authMiddleware, updatePost);

// DELETE POST
router.delete('/:id', authMiddleware, deletePost);

router.post("/:id/answer", authMiddleware, addAnswer);

module.exports = router;