const mongoose = require('mongoose');

const VideoChangeSchema = new mongoose.Schema({
  videoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Video' },
  title: { type: String, required: true },
  category: { type: String },
  section: { type: String },
  action: { type: String, enum: ['deleted'], required: true },
  performedBy: { type: String, required: true },
  performedAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('VideoChange', VideoChangeSchema);
