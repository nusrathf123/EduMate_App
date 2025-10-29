require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);


const app = express();
connectDB();

app.use(cors());
app.use(express.json({ limit: '10mb' })); // allow JSON + file metadata
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => res.send('EDUMATE backend running'));

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/upload', require('./routes/uploadRoutes'));
app.use('/uploads', express.static('uploads')); // to serve files


// sample protected route
const protect = require('./middleware/authMiddleware');
app.get('/api/me', protect, (req, res) => {
  res.json({ user: req.user });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
