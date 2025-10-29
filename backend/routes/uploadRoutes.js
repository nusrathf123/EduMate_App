const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

// Storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

// Filter only pdf or image
const fileFilter = (req, file, cb) => {
  const allowed = ["application/pdf", "image/jpeg", "image/png"];
  if (allowed.includes(file.mimetype)) cb(null, true);
  else cb(new Error("Only PDF, JPG, or PNG allowed!"), false);
};

const upload = multer({ storage, fileFilter });

// 📄 Upload PDF route
router.post("/pdf", upload.single("pdfFile"), (req, res) => {
  if (!req.file) return res.status(400).json({ msg: "No file uploaded" });
  res.json({
    msg: "PDF uploaded successfully",
    filename: req.file.filename,
    path: req.file.path,
  });
});

// 🖼️ Upload Avatar route
router.post("/avatar", upload.single("avatar"), (req, res) => {
  if (!req.file) return res.status(400).json({ msg: "No image uploaded" });
  res.json({
    msg: "Avatar uploaded successfully",
    filename: req.file.filename,
    path: req.file.path,
  });
});

module.exports = router;
