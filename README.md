# 🏒 ХК «Ледокол Гродно»

Полнофункциональный сайт любительского хоккейного клуба с админ-панелью, JWT-аутентификацией, MongoDB и PWA.

## 🚀 Стек

**Frontend:** React 18, Vite, Tailwind CSS, Framer Motion, Recharts, React Hot Toast, React Helmet Async

**Backend:** Node.js, Express, MongoDB (Mongoose), JWT, bcryptjs, multer, express-rate-limit

## ⚡ Быстрый старт

```bash
# Установка зависимостей
npm install
cd server && npm install

# Переменные окружения
cp server/.env.example server/.env
# Отредактируй server/.env — укажи MONGO_URI и JWT_SECRET

# Запуск сервера
cd server && node seed.js   # первоначальное заполнение БД
node index.js               # запуск API

# Запуск фронтенда (в новом терминале)
npm run dev
```

- **Фронт:** http://localhost:5173
- **API:** http://localhost:5000

## 🔑 Данные для входа

| Роль | Email | Пароль |
|------|-------|--------|
| Админ | `admin@ledokol-grodno.by` | `Ledokol2026!Admin` |

## 📁 Структура проекта

```
├── public/           # PWA: manifest, service worker, offline page
├── server/           # Node.js/Express API
│   ├── config/       # Подключение к MongoDB
│   ├── middleware/   # auth, admin, upload
│   ├── models/       # Mongoose схемы
│   ├── routes/       # API endpoints
│   ├── seed.js       # Начальные данные
│   └── index.js      # Точка входа
├── src/
│   ├── components/   # React компоненты
│   ├── context/      # AuthContext, ThemeContext
│   ├── data/         # Локальные данные (fallback)
│   ├── pages/        # Страницы приложения
│   ├── services/     # API клиент
│   └── styles/       # Глобальные стили
```

## ✨ Функционал

### Публичная часть
- Главная с героем, следующим матчем, новостями, турнирной таблицей, составом, галереей, магазином
- Страницы: Новости, Команда, Расписание, Турниры, Галерея, О клубе, Контакты
- Детальные страницы: новость, игрок, матч (с голосованием)
- Покупка билетов с выбором сектора и ряда
- Подписка на новости по email
- Комментарии к новостям (для авторизованных)
- Голосование за лучшего игрока матча
- PWA — установка на телефон, офлайн-режим

### Личный кабинет
- История билетов
- Профиль

### Админ-панель (`/admin`)
- CRUD новостей с загрузкой изображений
- CRUD игроков с биографией и статистикой
- CRUD матчей
- CRUD турнирной таблицы
- Редактирование и удаление записей

### Безопасность
- Rate limiting (200 req/15min, 10 для auth)
- JWT токены
- Защищённые admin-only роуты
- Хеширование паролей (bcrypt)

## 🛠 API Endpoints

| Метод | Путь | Описание |
|-------|------|----------|
| POST | `/api/auth/login` | Вход |
| POST | `/api/auth/register` | Регистрация |
| GET | `/api/auth/me` | Текущий пользователь |
| GET | `/api/news` | Все новости |
| GET | `/api/news/:id` | Одна новость |
| GET | `/api/players` | Все игроки |
| GET | `/api/players/:id` | Один игрок |
| GET | `/api/matches` | Все матчи |
| GET | `/api/matches/next` | Следующий матч |
| GET | `/api/standings` | Турнирная таблица |
| GET | `/api/tournaments` | Все турниры |
| GET | `/api/comments/news/:id` | Комментарии к новости |
| POST | `/api/tickets` | Создать билет |
| POST | `/api/subscribers` | Подписаться |
| POST | `/api/upload` | Загрузить изображение (admin) |

## 📝 Лицензия

MIT
