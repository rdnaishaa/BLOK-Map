const jwt = require('jsonwebtoken');
const db = require('../config/pg.database');

// Middleware untuk melindungi route dengan autentikasi
exports.protect = async (req, res, next) => {
  let token;

  // Ambil token dari header Authorization
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  // Jika tidak ada token
  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized to access this route' });
  }

  try {
    // Verifikasi token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Ambil data pengguna dari database PostgreSQL menggunakan ID yang ada di dalam token
    const result = await db.query('SELECT * FROM users WHERE id = $1', [decoded.id]);
    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found' });
    }

    req.user = user; // Simpan data user pada req.user
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Not authorized' });
  }
};

// Middleware untuk otorisasi role
exports.authorize = (...roles) => {
  return (req, res, next) => {
    // Cek apakah role user ada dalam daftar role yang diizinkan
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role '${req.user.role}' is not authorized to access this route`
      });
    }
    next(); // Lanjutkan ke route jika role cocok
  };
};
