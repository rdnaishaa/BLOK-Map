const jwt = require('jsonwebtoken');
const baseResponse = require('../utils/baseResponse.util');

exports.protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const result = await db.query('SELECT * FROM users WHERE id = $1', [decoded.id]);

    if (!result.rows[0]) {
      return res.status(401).json({ success: false, message: 'User not found' });
    }

    req.user = result.rows[0]; // Role tersedia di req.user.role
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Invalid token' });
  }
};

exports.isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }

  return res.status(403).json({ success: false, message: 'Permission denied. Admin only.' });
};