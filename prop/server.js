const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const authRoutes = require('./routes/auth');
const videoRoutes = require('./routes/videos');
const adminRoutes = require('./routes/admin');
const Video = require('./models/Video');

const app = express();
app.use(cors());
app.use(express.json());

// Serve static files from the build directory
app.use(express.static(path.join(__dirname, 'build')));

app.use('/api/auth', authRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/admin', adminRoutes);

app.get('/api/status', (req, res) => {
  res.json({ status: 'ok' });
});

// Catch-all handler to serve index.html for client-side routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/bingebox';
const PORT = process.env.PORT || 5000;

const seedVideos = async () => {
  const count = await Video.countDocuments();
  if (count > 0) {
    return;
  }

  const homeData = require('./src/data/homeData.json');
  const animeData = require('./src/data/animeData.json');
  const dramaData = require('./src/data/dramaData.json');

  const items = [];

  Object.entries(homeData).forEach(([section, videos]) => {
    videos.forEach(video => {
      items.push({
        ...video,
        category: 'home',
        section
      });
    });
  });

  Object.entries(animeData).forEach(([section, videos]) => {
    videos.forEach(video => {
      items.push({
        ...video,
        category: 'anime',
        section
      });
    });
  });

  Object.entries(dramaData).forEach(([section, videos]) => {
    videos.forEach(video => {
      items.push({
        ...video,
        category: 'drama',
        section
      });
    });
  });

  if (items.length > 0) {
    await Video.insertMany(items);
    console.log('Seeded video data to MongoDB');
  }
};

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log('Connected to MongoDB');
    await seedVideos();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });
