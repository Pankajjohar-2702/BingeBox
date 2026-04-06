const express = require('express');
const auth = require('../middleware/auth');
const User = require('../models/User');
const VideoChange = require('../models/VideoChange');

const router = express.Router();

router.get('/users', auth, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin authorization required' });
  }

  try {
    const users = await User.find({}, 'username role createdAt updatedAt').lean();
    return res.json(users);
  } catch (error) {
    return res.status(500).json({ message: 'Server error' });
  }
});

router.get('/changes', auth, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin authorization required' });
  }

  try {
    const changes = await VideoChange.find().sort({ performedAt: -1 }).lean();
    return res.json(changes);
  } catch (error) {
    return res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
