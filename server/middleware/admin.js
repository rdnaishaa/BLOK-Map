// Middleware to check if user is admin (username === 'sbd')
module.exports = function isAdmin(req, res, next) {
  try {
    // req.user harus sudah diisi oleh middleware autentikasi sebelumnya
    if (req.user && req.user.username === 'sbd') {
      return next();
    }
    return res.status(403).json({ message: 'Forbidden: Admins only' });
  } catch (err) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
};
