const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  number: { type: Number, required: true },
  position: { type: String, required: true },
  stats: { type: String, required: true },
  image: { type: String, default: '' },
  bio: { type: String, default: '' },
  birthDate: { type: String, default: '' },
  height: { type: Number, default: 0 },
  weight: { type: Number, default: 0 },
  country: { type: String, default: 'Беларусь' },
  goals: { type: Number, default: 0 },
  assists: { type: Number, default: 0 },
  games: { type: Number, default: 0 },
  penaltyMinutes: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Player', playerSchema);
