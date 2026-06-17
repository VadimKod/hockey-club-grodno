const mongoose = require('mongoose');
const tournamentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  season: { type: String, required: true },
  startDate: String,
  endDate: String,
  status: { type: String, enum: ['upcoming', 'current', 'finished'], default: 'upcoming' },
  description: String,
  finalPlace: Number
}, { timestamps: true });
module.exports = mongoose.model('Tournament', tournamentSchema);
