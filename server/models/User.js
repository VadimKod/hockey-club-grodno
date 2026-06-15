const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['guest', 'user1', 'user2', 'admin'], 
    default: 'user2' 
  },
  // Для пользователей первого уровня (игроки и тренеры)
  teamPosition: { type: String }, // позиция в команде
  jerseyNumber: { type: Number }, // номер на форме
  // Настройки уведомлений
  notifications: {
    trainingSchedule: { type: Boolean, default: true }, // расписание тренировок
    matchSchedule: { type: Boolean, default: true },    // расписание матчей
    ticketUpdates: { type: Boolean, default: true }      // уведомления о билетах
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
