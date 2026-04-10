const jwt = require('jsonwebtoken');

const adminAuthMiddleware = (req, res, next) => {
  const adminToken = req.header('x-admin-auth-token');

  if (!adminToken) {
    return res.status(401).json({ message: 'No admin token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(adminToken, process.env.JWT_SECRET);
    if (decoded.role !== 'admin') {
       return res.status(403).json({ message: 'Forbidden: Admins only' });
    }
    
    req.admin = decoded; // Attach admin payload
    next();
  } catch (err) {
    res.status(401).json({ message: 'Admin token is not valid' });
  }
};

module.exports = adminAuthMiddleware;
