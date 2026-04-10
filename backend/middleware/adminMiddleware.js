const User = require('../models/User');
const Admin = require('../models/Admin');

const adminMiddleware = async (req, res, next) => {
  try {
    // Check if the ID exists in the Admin collection first
    let admin = await Admin.findById(req.user.id);
    
    if (!admin) {
      // If not in Admin, check User collection for isAdmin flag
      const user = await User.findById(req.user.id);
      if (!user || user.isAdmin !== true) {
        return res.status(403).json({ message: 'Access denied: Requires Admin Role' });
      }
    }

    next();
  } catch (error) {
    res.status(500).json({ message: 'Server error checking admin privileges' });
  }
};

module.exports = adminMiddleware;
