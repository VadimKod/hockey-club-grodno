const mongoose = require('mongoose');
const standingSchema = new mongoose.Schema({
  pos: { type: Number, required: true },
  team: { type: String, required: true },
  gp: { type: Number, default: 0 },
  w: { type: Number, default: 0 },
  ot: { type: Number, default: 0 },
  l: { type: Number, default: 0 },
  gf: { type: Number, default: 0 },
  ga: { type: Number, default: 0 },
  pts: { type: Number, default: 0 }
}, { timestamps: true });
module.exports = mongoose.model('Standing', standingSchema);
