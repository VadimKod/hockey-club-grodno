const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { auth, isAdmin, isUserLevel1, hasRole } = require('../middleware/auth');
const router = express.Router();

// Регистрация (по умолчанию роль user2 - пользователь второго уровня)
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Пользователь уже существует' });

    // Роль может быть назначена только админом при создании, иначе 'user2'
    const userRole = role && ['user1', 'user2'].includes(role) ? role : 'user2';
    
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ 
      name, 
      email, 
      password: hashed,
      role: userRole
    });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ 
      token, 
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email, 
        role: user.role,
        teamPosition: user.teamPosition,
        jerseyNumber: user.jerseyNumber
      } 
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Вход
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Неверные данные' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Неверные данные' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ 
      token, 
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email, 
        role: user.role,
        teamPosition: user.teamPosition,
        jerseyNumber: user.jerseyNumber,
        notifications: user.notifications
      } 
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Получить текущего пользователя
router.get('/me', auth, async (req, res) => {
  res.json(req.user);
});

// Обновить настройки уведомлений
router.put('/notifications', auth, async (req, res) => {
  try {
    const { trainingSchedule, matchSchedule, ticketUpdates } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { 
        notifications: {
          trainingSchedule: trainingSchedule ?? req.user.notifications.trainingSchedule,
          matchSchedule: matchSchedule ?? req.user.notifications.matchSchedule,
          ticketUpdates: ticketUpdates ?? req.user.notifications.ticketUpdates
        }
      },
      { new: true }
    ).select('-password');
    
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Обновить профиль пользователя первого уровня (только для user1 и админов)
router.put('/profile', auth, isUserLevel1, async (req, res) => {
  try {
    const { teamPosition, jerseyNumber } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { teamPosition, jerseyNumber },
      { new: true }
    ).select('-password');
    
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Получить всех пользователей первого уровня (только админ)
router.get('/level1-users', auth, isAdmin, async (req, res) => {
  try {
    const members = await User.find({ role: 'user1' })
      .select('-password');
    res.json(members);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Назначить роль пользователю (только админ)
router.put('/:id/role', auth, isAdmin, async (req, res) => {
  try {
    const { role } = req.body;
    if (!['user1', 'user2', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Недопустимая роль' });
    }
    
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select('-password');
    
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
