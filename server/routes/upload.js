const express = require('express');
const upload = require('../middleware/upload');
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

router.post('/', authAndAdmin, upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'Файл не загружен' });
  const url = `/uploads/${req.file.filename}`;
  res.json({ url });
});

module.exports = router;
