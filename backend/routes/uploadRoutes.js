const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// 1️⃣ Ensure uploads folder exists
const uploadPath = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath);
}

// 2️⃣ Storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});

// 3️⃣ Allow only PDF or images
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["application/pdf", "image/jpeg", "image/png"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only PDF, JPG, or PNG files are allowed"), false);
  }
};

// 4️⃣ Initialize multer
const upload = multer({ storage, fileFilter });

// ================= ROUTES =================

// 📄 Upload PDF route
router.post("/pdf", upload.single("pdfFile"), (req, res) => {
  if (!req.file)
    return res.status(400).json({ msg: "No file uploaded" });

  res.json({
    msg: "✅ PDF uploaded successfully!",
    filename: req.file.filename,
    path: req.file.path,
  });
});

// 🖼️ Upload Avatar route
router.post("/avatar", upload.single("avatar"), (req, res) => {
  if (!req.file)
    return res.status(400).json({ msg: "No image uploaded" });

  res.json({
    msg: "✅ Avatar uploaded successfully!",
    filename: req.file.filename,
    path: req.file.path,
  });
});

module.exports = router;
