const express = require('express');
const Vote = require('../models/Vote');
const { auth } = require('../middleware/auth');
const router = express.Router();
router.get('/match/:matchId', async (req, res) => {
  try {
    const votes = await Vote.aggregate([
      { $match: { matchId: new require('mongoose').Types.ObjectId(req.params.matchId) } },
      { $group: { _id: '$playerId', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    res.json(votes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.post('/', auth, async (req, res) => {
  try {
    const { matchId, playerId } = req.body;
    const existing = await Vote.findOne({ matchId, userId: req.user._id });
    if (existing) return res.status(400).json({ message: 'Вы уже проголосовали' });
    const vote = await Vote.create({ matchId, playerId, userId: req.user._id });
    res.status(201).json(vote);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
module.exports = router;
