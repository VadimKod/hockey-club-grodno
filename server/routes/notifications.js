const express = require('express');
const { auth, isAdmin } = require('../middleware/auth');
const { 
  sendTrainingScheduleNotification, 
  sendMatchScheduleNotification 
} = require('../services/notificationService');
const router = express.Router();
router.post('/training-schedule', auth, isAdmin, async (req, res) => {
  try {
    console.log('📧 Отправка рассылки пользователям 1 уровня...');
    const result = await sendTrainingScheduleNotification();
    console.log(`✅ Рассылка отправлена: ${result.sent}/${result.total}`);
    res.json({ 
      message: 'Рассылка отправлена', 
      success: true,
      ...result 
    });
  } catch (err) {
    console.error('❌ Ошибка рассылки:', err.message);
    res.status(500).json({ 
      message: err.message || 'Ошибка отправки рассылки',
      success: false 
    });
  }
});
router.post('/match-schedule', auth, isAdmin, async (req, res) => {
  try {
    console.log('📧 Отправка рассылки пользователям 2 уровня...');
    const result = await sendMatchScheduleNotification();
    console.log(`✅ Рассылка отправлена: ${result.sent}/${result.total}`);
    res.json({ 
      message: 'Рассылка отправлена', 
      success: true,
      ...result 
    });
  } catch (err) {
    console.error('❌ Ошибка рассылки:', err.message);
    res.status(500).json({ 
      message: err.message || 'Ошибка отправки рассылки',
      success: false 
    });
  }
});
module.exports = router;
