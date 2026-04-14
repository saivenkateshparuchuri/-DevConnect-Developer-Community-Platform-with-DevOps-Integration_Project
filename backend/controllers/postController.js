const Post = require('../models/Post');
const { trackUserStreakActivity } = require('../utils/streakActivity');

const touchUserActivity = async (userId) => {
  await trackUserStreakActivity(userId);
};

// ✅ createPost
const createPost = async (req, res) => {
  try {
    const { title, content } = req.body;

    const post = new Post({
      title,
      content,
      user: req.user.id
    });

    await post.save();
    await touchUserActivity(req.user.id);
    res.status(201).json(post);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ getPosts
const getPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('user', 'name email')
      .populate('answers.user', 'name');

    res.json(posts);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ deletePost
const deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (post.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    await post.deleteOne();
    res.json({
      success: true,
      message: 'Post deleted successfully',
      deleted: {
        id: postId,
        type: 'post'
      }
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ updatePost
const updatePost = async (req, res) => {
  try {
    const { title, content } = req.body;

    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (post.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    post.title = title || post.title;
    post.content = content || post.content;

    await post.save();
    await touchUserActivity(req.user.id);
    res.json(post);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ addAnswer
const addAnswer = async (req, res) => {
  try {
    const { text } = req.body;

    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    post.answers.push({
      text,
      user: req.user.id,
    });

    await post.save();
    await touchUserActivity(req.user.id);

    res.json(post);

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ FINAL EXPORT
module.exports = {
  createPost,
  getPosts,
  deletePost,
  updatePost,
  addAnswer,
};