const express = require('express');
const Subscriber = require('../models/Subscriber');
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
router.post('/', async (req, res) => {
  try {
    const { email } = req.body;
    const existing = await Subscriber.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Этот email уже подписан' });
    const sub = await Subscriber.create({ email });
    res.status(201).json(sub);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.get('/', authAndAdmin, async (req, res) => {
  const subs = await Subscriber.find().sort({ createdAt: -1 });
  res.json(subs);
});
router.delete('/:id', authAndAdmin, async (req, res) => {
  await Subscriber.findByIdAndDelete(req.params.id);
  res.json({ message: 'Удалено' });
});
module.exports = router;
