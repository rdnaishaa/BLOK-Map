// Middleware to check if user is admin (req.user.role === 'admin')
module.exports = function isAdmin(req, res, next) {
  try {
    // Debug: log req.user
    console.log('req.user:', req.user);
    // req.user harus sudah diisi oleh middleware autentikasi sebelumnya
    if (req.user && req.user.role === 'admin') {
      return next();
    }
    return res.status(403).json({ message: 'Forbidden: Admins only' });
  } catch (err) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
};
