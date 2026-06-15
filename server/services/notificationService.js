const nodemailer = require('nodemailer');
const User = require('../models/User');
const Match = require('../models/Match');

// Настройка транспортера для email
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
};

// Отправка email
const sendEmail = async (to, subject, html) => {
  try {
    const transporter = createTransporter();
    await transporter.sendMail({
      from: `"Хоккейный клуб Ледокол" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html
    });
    console.log(`Email отправлен: ${to}`);
  } catch (error) {
    console.error('Ошибка отправки email:', error.message);
  }
};

// Рассылка пользователям первого уровня о расписании тренировок и матчей
const sendTrainingScheduleNotification = async () => {
  try {
    // Получаем всех пользователей первого уровня с включёнными уведомлениями
    const level1Users = await User.find({
      role: 'user1',
      'notifications.trainingSchedule': true
    });

    if (level1Users.length === 0) return;

    // Получаем ближайшие матчи
    const upcomingMatches = await Match.find({
      date: { $gte: new Date() }
    }).sort({ date: 1 }).limit(5);

    const html = `
      <h2>🏒 Расписание тренировок и матчей</h2>
      <p>Уважаемые пользователи первого уровня!</p>
      <p>Предстоящие матчи:</p>
      <ul>
        ${upcomingMatches.map(match => `
          <li>
            <strong>${match.opponent}</strong><br>
            Дата: ${new Date(match.date).toLocaleDateString('ru-RU')}<br>
            Время: ${new Date(match.date).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}<br>
            Место: ${match.venue || 'Домашняя арена'}
          </li>
        `).join('')}
      </ul>
      <p>Не забудьте явиться на тренировку согласно расписанию!</p>
      <p style="color: #666; font-size: 12px;">Это автоматическое уведомление. Для изменения настроек обратитесь в админ-панель.</p>
    `;

    for (const user of level1Users) {
      await sendEmail(user.email, '🏒 Расписание тренировок и матчей', html);
    }

    return { sent: clubMembers.length };
  } catch (error) {
    console.error('Ошибка рассылки расписания:', error);
    throw error;
  }
};

// Рассылка пользователям второго уровня о предстоящих матчах
const sendMatchScheduleNotification = async () => {
  try {
    // Получаем всех пользователей второго уровня с включёнными уведомлениями о матчах
    const level2Users = await User.find({
      role: 'user2',
      'notifications.matchSchedule': true
    });

    if (level2Users.length === 0) return;

    // Получаем ближайшие матчи
    const upcomingMatches = await Match.find({
      date: { $gte: new Date() }
    }).sort({ date: 1 }).limit(3);

    const html = `
      <h2>🏒 Предстоящие матчи ХК "Ледокол"</h2>
      <p>Уважаемые болельщики!</p>
      <p>Приглашаем вас поддержать нашу команду!</p>
      <ul>
        ${upcomingMatches.map(match => `
          <li style="margin-bottom: 15px;">
            <strong style="font-size: 16px;">${match.opponent}</strong><br>
            📅 ${new Date(match.date).toLocaleDateString('ru-RU', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}<br>
            🕐 ${new Date(match.date).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}<br>
            📍 ${match.venue || 'Домашняя арена'}
          </li>
        `).join('')}
      </ul>
      <p style="margin-top: 20px;">
        <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/tickets" 
           style="background: #ef4444; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block;">
          Купить билеты
        </a>
      </p>
      <p style="color: #666; font-size: 12px; margin-top: 20px;">
        Это автоматическое уведомление. 
        <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/profile">Изменить настройки уведомлений</a>
      </p>
    `;

    for (const user of level2Users) {
      await sendEmail(user.email, '🏒 Предстоящие матчи ХК "Ледокол"', html);
    }

    return { sent: fans.length };
  } catch (error) {
    console.error('Ошибка рассылки о матчах:', error);
    throw error;
  }
};

// Уведомление о заказе билета
const sendTicketNotification = async (userEmail, ticketData) => {
  try {
    const user = await User.findOne({ email: userEmail });
    
    // Проверяем, включены ли уведомления о билетах (только для пользователей второго уровня)
    if (!user || user.role !== 'user2' || !user.notifications.ticketUpdates) {
      return { skipped: true, reason: 'Уведомления отключены' };
    }

    const match = await Match.findById(ticketData.matchId);
    
    const html = `
      <h2>🎫 Подтверждение заказа билета</h2>
      <p>Спасибо за ваш заказ!</p>
      <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3>Детали заказа:</h3>
        <p><strong>Матч:</strong> ${match?.opponent || 'Будет объявлен позже'}</p>
        <p><strong>Дата:</strong> ${match ? new Date(match.date).toLocaleDateString('ru-RU') : 'Будет объявлена позже'}</p>
        <p><strong>Место:</strong> ${ticketData.seat || 'Общее место'}</p>
        <p><strong>Категория:</strong> ${ticketData.category || 'Стандарт'}</p>
        <p><strong>Количество:</strong> ${ticketData.quantity || 1}</p>
        <p><strong>Стоимость:</strong> ${ticketData.totalPrice || 0} BYN</p>
      </div>
      <p>Приходите заранее! Двери открываются за 1 час до матча.</p>
      <p style="color: #666; font-size: 12px;">Это автоматическое уведомление. При предъявлении на входе покажите этот email или QR-код.</p>
    `;

    await sendEmail(userEmail, '🎫 Ваш билет заказан!', html);
    return { sent: true };
  } catch (error) {
    console.error('Ошибка отправки уведомления о билете:', error);
    throw error;
  }
};

module.exports = {
  sendTrainingScheduleNotification,
  sendMatchScheduleNotification,
  sendTicketNotification
};
