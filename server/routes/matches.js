const express = require('express');
const Match = require('../models/Match');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();
router.get('/', async (req, res) => {
  try {
    const matches = await Match.find().sort({ createdAt: -1 });
    res.json(matches);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.get('/next', async (req, res) => {
  try {
    const next = await Match.findOne({ isNext: true });
    res.json(next);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
const authAndAdmin = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ message: 'Нет токена' });
  }
  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) return res.status(401).json({ message: 'Токен недействителен' });
    try {
      req.user = await User.findById(decoded.id).select('-password');
      if (!req.user) return res.status(401).json({ message: 'Пользователь не найден' });
      if (req.user.role !== 'admin') return res.status(403).json({ message: 'Доступ запрещён. Требуются права администратора' });
      next();
    } catch (error) {
      res.status(401).json({ message: 'Токен недействителен' });
    }
  });
};
router.post('/', authAndAdmin, async (req, res) => {
  try {
    const match = await Match.create(req.body);
    res.status(201).json(match);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.put('/:id', authAndAdmin, async (req, res) => {
  try {
    const match = await Match.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!match) return res.status(404).json({ message: 'Матч не найден' });
    res.json(match);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.delete('/:id', authAndAdmin, async (req, res) => {
  try {
    const match = await Match.findByIdAndDelete(req.params.id);
    if (!match) return res.status(404).json({ message: 'Матч не найден' });
    res.json({ message: 'Матч удалён' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
module.exports = router;
