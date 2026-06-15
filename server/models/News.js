const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema({
  title: { type: String, required: true },
  date: { type: String, required: true },
  category: { type: String, required: true },
  excerpt: { type: String, required: true },
  content: { type: String, default: '' },
  image: { type: String, default: '' },
  views: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('News', newsSchema);
