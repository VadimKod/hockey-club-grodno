const express = require('express');
const { auth, isAdmin } = require('../middleware/auth');
const { 
  sendTrainingScheduleNotification, 
  sendMatchScheduleNotification 
} = require('../services/notificationService');
const router = express.Router();

// Отправить рассылку пользователям первого уровня (только админ)
router.post('/training-schedule', auth, isAdmin, async (req, res) => {
  try {
    const result = await sendTrainingScheduleNotification();
    res.json({ message: 'Рассылка отправлена', ...result });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Отправить рассылку пользователям второго уровня (только админ)
router.post('/match-schedule', auth, isAdmin, async (req, res) => {
  try {
    const result = await sendMatchScheduleNotification();
    res.json({ message: 'Рассылка отправлена', ...result });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
