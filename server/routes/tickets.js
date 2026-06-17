const express = require('express');
const Ticket = require('../models/Ticket');
const { sendTicketNotification } = require('../services/notificationService');
const { auth } = require('../middleware/auth');
const router = express.Router();
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, count, total, seat, matchId, category, userId } = req.body;
    const ticket = await Ticket.create({ 
      name, 
      email, 
      phone, 
      count, 
      total, 
      seat,
      matchId,
      category,
      userId
    });
    console.log('📧 Отправка уведомления:', { email, total, seat, category, count, matchId });
    sendTicketNotification(email, { matchId, seat, category, quantity: count, totalPrice: total })
      .then(result => {
        console.log('📧 Результат отправки:', result);
        if (result && !result.sent && !result.skipped) {
          console.warn('Не удалось отправить уведомление о билете:', result.error);
        }
      })
      .catch(err => {
        console.error('Ошибка при отправке уведомления о билете:', err.message);
      });
    res.status(201).json({ 
      ticket,
      message: 'Билет успешно заказан'
    });
  } catch (err) {
    console.error('Ошибка создания билета:', err);
    res.status(500).json({ message: err.message || 'Ошибка при создании билета' });
  }
});
router.get('/my', auth, async (req, res) => {
  try {
    const tickets = await Ticket.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(tickets);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.get('/', auth, async (req, res) => {
  try {
    const tickets = await Ticket.find().sort({ createdAt: -1 });
    res.json(tickets);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
module.exports = router;
