const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: 'Нет токена, авторизация отклонена' });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user) {
      return res.status(401).json({ message: 'Пользователь не найден' });
    }
    next();
  } catch (error) {
    res.status(401).json({ message: 'Токен недействителен' });
  }
};
const isAdmin = async (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Доступ запрещён. Требуется роль администратора' });
  }
  next();
};
const isUserLevel1 = async (req, res, next) => {
  if (!req.user || !['user1', 'admin'].includes(req.user.role)) {
    return res.status(403).json({ message: 'Доступ запрещён. Требуется роль: пользователь первого уровня' });
  }
  next();
};
const isUserLevel2 = async (req, res, next) => {
  if (!req.user || !['user2', 'admin'].includes(req.user.role)) {
    return res.status(403).json({ message: 'Доступ запрещён. Требуется роль: пользователь второго уровня' });
  }
  next();
};
const hasRole = (roles) => {
  return async (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: `Доступ запрещён. Требуются роли: ${roles.join(', ')}` });
    }
    next();
  };
};
module.exports = { auth, isAdmin, isUserLevel1, isUserLevel2, hasRole };
