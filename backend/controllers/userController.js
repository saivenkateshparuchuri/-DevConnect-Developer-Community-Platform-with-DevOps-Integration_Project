const User = require("../models/User");
const Post = require("../models/Post");
const Admin = require("../models/Admin");

//  Get user profile
const getUserProfile = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId format manually if needed, or let Mongoose handle but catch specifically
    if (!id || id === 'undefined' || id.length !== 24) {
      return res.status(400).json({ message: "Invalid user ID format" });
    }

    let user = await User.findById(id).select("-password");
    let is_admin = false;

    if (!user) {
      // Check Admin collection
      user = await Admin.findById(id).select("-password");
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      is_admin = true;
    }

    const posts = await Post.find({ user: id });
    
    // Attach isAdmin flag for frontend consistency
    const userObj = user.toObject();
    if(is_admin) userObj.isAdmin = true;

    res.json({ user: userObj, posts });
  } catch (error) {
    console.error("Error in getUserProfile:", error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: "Invalid ID format" });
    }
    res.status(500).json({ message: "Server error" });
  }
};

//  Update profile
const updateProfile = async (req, res) => {
  try {
    const { name, bio, gender, photoUrl, targetId } = req.body;
    const isAdminAcc = req.user.role === 'admin' || req.user.isAdmin === true;
    
    // If targetId is provided, requester MUST be an admin to edit someone else
    const idToUpdate = (targetId && isAdminAcc) ? targetId : req.user.id;

    // Determine which collection to look in (Admin or User)
    // First check Admin collection if the ID belongs to an admin
    let user = await Admin.findById(idToUpdate);
    if (!user) {
      user = await User.findById(idToUpdate);
    }

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.name = name || user.name;
    user.bio = bio || user.bio;
    user.gender = gender || user.gender;

    if (req.file) {
      user.photoUrl = `/uploads/${req.file.filename}`;
    } else if (photoUrl !== undefined) {
      user.photoUrl = photoUrl;
    }

    await user.save();

    // Prepare response object
    const userObj = user.toObject();
    delete userObj.password;
    if (isAdminAcc && idToUpdate === req.user.id) userObj.isAdmin = true;

    res.json({ message: "Profile updated", user: userObj });

  } catch (error) {
    console.error("Error in updateProfile:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get top users (for sidebar)
const getTopUsers = async (req, res) => {
  try {
    const users = await User.find().select("name _id").limit(5); // just get 5 random/most recent users
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Admin: Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Admin: Delete user and their posts
const deleteUser = async (req, res) => {
  try {
    const targetId = req.params.id;
    const requesterId = req.user.id;

    console.log(`[Admin Delete] Attempting to delete ID: ${targetId} by Admin: ${requesterId}`);

    // Prevent self-deletion for safety (optional but recommended)
    if (String(targetId) === String(requesterId)) {
      return res.status(400).json({ message: "You cannot delete your own account while logged in." });
    }

    // Search in both collections
    let user = await User.findById(targetId);
    let collectionName = "User";

    if (!user) {
      user = await Admin.findById(targetId);
      collectionName = "Admin";
    }

    if (!user) {
      console.error(`[Admin Delete] Target ${targetId} not found in any collection.`);
      return res.status(404).json({ message: "Account not found" });
    }

    console.log(`[Admin Delete] Found target ${targetId} in ${collectionName} collection.`);

    // Cascade delete posts (only relevant for standard Users as Admins typically don't post)
    const postDeletion = await Post.deleteMany({ user: targetId });
    console.log(`[Admin Delete] Cascade deleted ${postDeletion.deletedCount} posts.`);

    // Final deletion
    await user.deleteOne();
    console.log(`[Admin Delete] Successfully deleted ${collectionName} account: ${targetId}`);

    res.json({ message: `${collectionName} and their posts deleted successfully` });
  } catch (error) {
    console.error("[Admin Delete] Server error during deletion:", error);
    res.status(500).json({ message: "Server error deleting user. Check logs for details." });
  }
};

//  EXPORT CORRECTLY
module.exports = {
  getUserProfile,
  updateProfile,
  getTopUsers,
  getAllUsers,
  deleteUser
};