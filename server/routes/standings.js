const express = require('express');
const Standing = require('../models/Standing');
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
    const standings = await Standing.find().sort({ pos: 1 });
    res.json(standings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.post('/', authAndAdmin, async (req, res) => {
  try {
    const item = await Standing.create(req.body);
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.put('/:id', authAndAdmin, async (req, res) => {
  try {
    const item = await Standing.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!item) return res.status(404).json({ message: 'Запись не найдена' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.delete('/:id', authAndAdmin, async (req, res) => {
  try {
    const item = await Standing.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: 'Запись не найдена' });
    res.json({ message: 'Запись удалена' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
module.exports = router;
