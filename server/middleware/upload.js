const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Folder untuk menyimpan file sementara
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname); // Format nama file
  },
});

const fileFilter = (req, file, cb) => {
  console.log("File received in multer:", file); // Log file yang diterima
  if (!file.mimetype.startsWith("image/")) {
    return cb(new Error("Only image files are allowed"), false);
  }
  cb(null, true);
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // Batas ukuran file 5MB
});

module.exports = upload;