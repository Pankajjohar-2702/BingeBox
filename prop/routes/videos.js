const express = require('express');
const Video = require('../models/Video');
const VideoChange = require('../models/VideoChange');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/', async (req, res) => {
  const category = req.query.category;
  const filter = {};
  if (category) {
    filter.category = category;
  }

  try {
    const videos = await Video.find(filter).sort({ createdAt: 1 }).lean();
    return res.json(videos);
  } catch (error) {
    return res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/:id', auth, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin authorization required' });
  }

  try {
    const deleted = await Video.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Video not found' });
    }

    await VideoChange.create({
      videoId: deleted._id,
      title: deleted.title,
      category: deleted.category,
      section: deleted.section,
      action: 'deleted',
      performedBy: req.user.username
    });

    return res.json({ message: 'Video deleted' });
  } catch (error) {
    return res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
