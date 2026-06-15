const express = require('express');
const News = require('../models/News');
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

// Получить все новости
router.get('/', async (req, res) => {
  try {
    const news = await News.find().sort({ createdAt: -1 });
    res.json(news || []);
  } catch (err) {
    console.error('News fetch error:', err.message);
    res.json([]);
  }
});

// Получить одну новость
router.get('/:id', async (req, res) => {
  try {
    const item = await News.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Новость не найдена' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Создать новость (admin)
router.post('/', authAndAdmin, async (req, res) => {
  try {
    const item = await News.create(req.body);
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Обновить новость (admin)
router.put('/:id', authAndAdmin, async (req, res) => {
  try {
    const item = await News.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!item) return res.status(404).json({ message: 'Новость не найдена' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Удалить новость (admin)
router.delete('/:id', authAndAdmin, async (req, res) => {
  try {
    const item = await News.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: 'Новость не найдена' });
    res.json({ message: 'Новость удалена' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
