const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  avatarUrl: { type: String, default: '' }, // for gamified avatar later
  points: { type: Number, default: 0 },     // for gamification
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
