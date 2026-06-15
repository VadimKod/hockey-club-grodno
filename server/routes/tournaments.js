const express = require('express');
const Tournament = require('../models/Tournament');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// Middleware для проверки auth и admin
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
    const tournaments = await Tournament.find().sort({ startDate: -1 });
    res.json(tournaments || []);
  } catch (err) {
    console.error('Tournaments fetch error:', err.message);
    res.json([]);
  }
});

router.get('/current', async (req, res) => {
  try {
    const tournament = await Tournament.findOne({ status: 'current' });
    res.json(tournament);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', authAndAdmin, async (req, res) => {
  try {
    const t = await Tournament.create(req.body);
    res.status(201).json(t);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/:id', authAndAdmin, async (req, res) => {
  try {
    const t = await Tournament.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(t);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/:id', authAndAdmin, async (req, res) => {
  try {
    await Tournament.findByIdAndDelete(req.params.id);
    res.json({ message: 'Удалено' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
