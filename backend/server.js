// ✅ Load environment variables
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const connectDB = require("./config/db");

const app = express();

// 🧠 Connect to MongoDB
connectDB();

// 🧾 Ensure 'uploads' folder exists
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
  console.log("📁 uploads folder created");
}

// 🌐 Middleware
app.use(cors());
app.use(express.json({ limit: "10mb" })); // allow JSON requests
app.use(express.urlencoded({ extended: true })); // allow form-data

// 🏠 Test route
app.get("/", (req, res) => {
  res.send("✅ EDUMATE backend running successfully");
});

// 📂 Serve static uploads
app.use("/uploads", express.static(uploadsDir));

// ✅ Import available route files only
const authRoutes = require("./routes/authRoutes");
const uploadRoutes = require("./routes/uploadRoutes");

// ✅ Use only existing routes for now
app.use("/api/auth", authRoutes);
app.use("/api/upload", uploadRoutes);


// 🚀 API Routes — safely require only valid routers
try {
  app.use("/api/auth", require("./routes/authRoutes"));
  app.use("/api/upload", require("./routes/uploadRoutes"));
  //app.use("/api/planner", require("./routes/plannerRoutes"));
  //app.use("/api/quiz", require("./routes/quizRoutes"));
  //app.use("/api/notes", require("./routes/notesRoutes"));
  //app.use("/api/resource", require("./routes/resourceRoutes"));
  //app.use("/api/chatbot", require("./routes/chatbotRoutes"));
  //app.use("/api/career", require("./routes/careerRoutes"));
} catch (err) {
  console.error("❌ Route import error:", err.message);
}

// 🔒 Protected route example
const protect = require("./middleware/authMiddleware");
app.get("/api/me", protect, (req, res) => {
  res.json({ user: req.user });
});

// 🚀 Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`⚙️ Server running on port ${PORT}`));
