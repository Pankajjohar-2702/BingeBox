const mongoose = require('mongoose');

const VideoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  thumbnail: { type: String, required: true },
  video: { type: String, required: true },
  category: { type: String, required: true },
  section: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Video', VideoSchema);
