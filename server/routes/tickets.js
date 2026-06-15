const express = require('express');
const Ticket = require('../models/Ticket');
const { sendTicketNotification } = require('../services/notificationService');
const { auth } = require('../middleware/auth');
const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { name, email, phone, count, total, seat, matchId, category, totalPrice, userId } = req.body;
    const ticket = await Ticket.create({ 
      name, 
      email, 
      phone, 
      count, 
      total, 
      seat,
      matchId,
      category,
      totalPrice,
      userId
    });
    
    // Отправляем уведомление фанату о заказе билета
    await sendTicketNotification(email, { matchId, seat, category, quantity: count, totalPrice });
    
    res.status(201).json(ticket);
  } catch (err) {
    res.status(500).json({ message: err.message });
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
