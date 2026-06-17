const express = require('express');
const Player = require('../models/Player');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();
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
router.get('/', async (req, res) => {
  try {
    const players = await Player.find().sort({ number: 1 });
    res.json(players);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.get('/:id', async (req, res) => {
  try {
    const player = await Player.findById(req.params.id);
    if (!player) return res.status(404).json({ message: 'Игрок не найден' });
    res.json(player);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.post('/', authAndAdmin, async (req, res) => {
  try {
    const player = await Player.create(req.body);
    res.status(201).json(player);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.put('/:id', authAndAdmin, async (req, res) => {
  try {
    const player = await Player.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!player) return res.status(404).json({ message: 'Игрок не найден' });
    res.json(player);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.delete('/:id', authAndAdmin, async (req, res) => {
  try {
    const player = await Player.findByIdAndDelete(req.params.id);
    if (!player) return res.status(404).json({ message: 'Игрок не найден' });
    res.json({ message: 'Игрок удалён' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
module.exports = router;
