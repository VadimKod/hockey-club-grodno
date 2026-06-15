const mongoose = require('mongoose');

const voteSchema = new mongoose.Schema({
  matchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Match', required: true },
  playerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Player', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

voteSchema.index({ matchId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model('Vote', voteSchema);
