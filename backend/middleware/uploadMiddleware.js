const multer = require("multer");
const path = require("path");

// Storage config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // folder to save uploaded files
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

// File filter for common document and image types
const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  const allowedTypes = ['.pdf', '.docx', '.doc', '.txt', '.jpg', '.jpeg', '.png'];
  
  if (allowedTypes.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error("Only PDF, DOCX, DOC, TXT, JPG, JPEG, PNG files are allowed"), false);
  }
};

const upload = multer({ storage, fileFilter });

module.exports = upload;
