const mongoose = require('mongoose');
const gallerySchema = new mongoose.Schema({
  image: { type: String, required: true },
  caption: { type: String, default: '' },
  category: { type: String, default: 'general' }
}, { timestamps: true });
module.exports = mongoose.model('Gallery', gallerySchema);
