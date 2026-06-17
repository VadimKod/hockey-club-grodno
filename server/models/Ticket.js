const mongoose = require('mongoose');
const ticketSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  matchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Match' },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  seat: { type: String, default: '' },
  count: { type: Number, default: 1 },
  total: { type: Number, default: 0 }, // Итоговая стоимость заказа
  category: { type: String, default: 'Стандарт' }, // Категория билета
  status: { type: String, enum: ['pending', 'paid', 'cancelled'], default: 'pending' },
  qrCode: { type: String, default: '' }
}, { timestamps: true });
module.exports = mongoose.model('Ticket', ticketSchema);
