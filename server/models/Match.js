const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema({
  homeTeam: { type: String, default: 'Ледокол Гродно' },
  awayTeam: { type: String, required: true },
  opponent: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, default: '19:30' },
  arena: { type: String, default: 'Ледовый дворец Арена' },
  result: { type: String, default: '' },
  isHome: { type: Boolean, default: true },
  homeLogo: { type: String, default: '🏒' },
  awayLogo: { type: String, default: '⚡' },
  isNext: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Match', matchSchema);
