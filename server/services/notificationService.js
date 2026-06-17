const nodemailer = require('nodemailer');
const User = require('../models/User');
const Match = require('../models/Match');
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
const sendEmail = async (to, subject, html) => {
  if (!process.env.SMTP_USER || process.env.SMTP_USER === 'your_email@gmail.com') {
    console.log('📧 EMAIL (тестовый режим):');
    console.log('   Кому:', to);
    console.log('   Тема:', subject);
    console.log('   --- HTML ---');
    console.log(html.substring(0, 500) + '...');
    console.log('   ------------');
    console.log('⚠️ Для реальной отправки настройте SMTP в .env файле!');
    return;
  }
  try {
    const transporter = createTransporter();
    await transporter.sendMail({
      from: `"Хоккейный клуб Ледокол" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html
    });
    console.log(`✅ Email отправлен: ${to}`);
  } catch (error) {
    console.error('❌ Ошибка отправки email:', error.message);
    throw error;
  }
};
const sendTrainingScheduleNotification = async () => {
  try {
    const level1Users = await User.find({
      role: 'user1',
      'notifications.trainingSchedule': true
    });
    if (level1Users.length === 0) {
      return { sent: 0, message: 'Нет пользователей с включёнными уведомлениями' };
    }
    const upcomingMatches = await Match.find({
      date: { $gte: new Date() }
    }).sort({ date: 1 }).limit(5);
    const html = `
      <h2>🏒 Расписание тренировок и матчей</h2>
      <p>Уважаемые пользователи первого уровня!</p>
      <p>Предстоящие матчи:</p>
      <ul>
        ${upcomingMatches.length > 0 ? upcomingMatches.map(match => `
          <li>
            <strong>${match.opponent}</strong><br>
            Дата: ${match.date}<br>
            Время: ${match.time || '19:00'}<br>
            Место: ${match.arena || 'Домашняя арена'}
          </li>
        `).join('') : '<li>Матчи пока не запланированы</li>'}
      </ul>
      <p>Не забудьте явиться на тренировку согласно расписанию!</p>
      <p style="color: #666; font-size: 12px;">Это автоматическое уведомление. Для изменения настроек обратитесь в админ-панель.</p>
    `;
    let sentCount = 0;
    for (const user of level1Users) {
      try {
        await sendEmail(user.email, '🏒 Расписание тренировок и матчей', html);
        sentCount++;
      } catch (err) {
        console.error(`Не удалось отправить email ${user.email}:`, err.message);
      }
    }
    return { sent: sentCount, total: level1Users.length };
  } catch (error) {
    console.error('Ошибка рассылки расписания:', error);
    throw error;
  }
};
const sendMatchScheduleNotification = async () => {
  try {
    const level2Users = await User.find({
      role: 'user2',
      'notifications.matchSchedule': true
    });
    if (level2Users.length === 0) {
      return { sent: 0, message: 'Нет пользователей с включёнными уведомлениями' };
    }
    const upcomingMatches = await Match.find({
      isNext: true
    }).sort({ date: 1 }).limit(3);
    const html = `
      <h2>🏒 Предстоящие матчи ХК "Ледокол"</h2>
      <p>Уважаемые болельщики!</p>
      <p>Приглашаем вас поддержать нашу команду!</p>
      <ul>
        ${upcomingMatches.length > 0 ? upcomingMatches.map(match => `
          <li style="margin-bottom: 15px; padding: 10px; background: #f9fafb; border-radius: 8px;">
            <strong style="font-size: 16px; color: #ef4444;">${match.homeTeam} vs ${match.awayTeam}</strong><br>
            📅 ${match.date}<br>
            🕐 ${match.time || '19:00'}<br>
            📍 ${match.arena || 'Домашняя арена'}
          </li>
        `).join('') : '<li>Матчи пока не запланированы</li>'}
      </ul>
      <p style="margin-top: 20px;">
        <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/tickets" 
           style="background: #ef4444; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">
          🎫 Купить билеты
        </a>
      </p>
      <p style="color: #666; font-size: 12px; margin-top: 20px;">
        Это автоматическое уведомление. 
        <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/profile" style="color: #ef4444;">Изменить настройки уведомлений</a>
      </p>
    `;
    let sentCount = 0;
    for (const user of level2Users) {
      try {
        await sendEmail(user.email, '🏒 Предстоящие матчи ХК "Ледокол"', html);
        sentCount++;
      } catch (err) {
        console.error(`Не удалось отправить email ${user.email}:`, err.message);
      }
    }
    return { sent: sentCount, total: level2Users.length };
  } catch (error) {
    console.error('Ошибка рассылки о матчах:', error);
    throw error;
  }
};
const sendTicketNotification = async (userEmail, ticketData) => {
  try {
    const user = await User.findOne({ email: userEmail });
    if (user && user.role !== 'user2' || (user && !user.notifications.ticketUpdates)) {
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
    console.error('Ошибка отправки уведомления о билете:', error.message);
    return { sent: false, error: error.message };
  }
};
module.exports = {
  sendTrainingScheduleNotification,
  sendMatchScheduleNotification,
  sendTicketNotification
};
