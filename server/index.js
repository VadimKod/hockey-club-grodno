require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');

const app = express();

connectDB().catch((err) => {
  console.error('Ошибка подключения к MongoDB:', err.message);
  console.log('Сервер будет работать без БД');
});

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 минут
  max: 200, // 200 запросов с одного IP
  message: { message: 'Слишком много запросов. Попробуйте позже.' }
});
app.use(limiter);

// Strict limit for auth
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { message: 'Слишком много попыток входа. Попробуйте через 15 минут.' }
});

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', authLimiter, require('./routes/auth'));
app.use('/api/matches', require('./routes/matches'));
app.use('/api/news', require('./routes/news'));
app.use('/api/players', require('./routes/players'));
app.use('/api/standings', require('./routes/standings'));
app.use('/api/gallery', require('./routes/gallery'));
app.use('/api/upload', require('./routes/upload'));
app.use('/api/subscribers', require('./routes/subscribers'));
app.use('/api/comments', require('./routes/comments'));
app.use('/api/votes', require('./routes/votes'));
app.use('/api/tickets', require('./routes/tickets'));
app.use('/api/tournaments', require('./routes/tournaments'));
app.use('/api/notifications', require('./routes/notifications'));

// В production раздаём собранный фронтенд
const frontendDist = path.join(__dirname, '..', 'dist');
app.use(express.static(frontendDist));
app.get('*', (req, res) => {
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(frontendDist, 'index.html'));
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Сервер запущен на порту ${PORT}`));
