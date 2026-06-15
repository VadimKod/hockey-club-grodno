# Hockey Club Server

Бэкенд для хоккейного сайта на Node.js + Express + MongoDB.

## Возможности

- JWT-авторизация с 4 ролями (гость, пользователь 1 уровня, пользователь 2 уровня, админ)
- Email-уведомления и рассылки
- CRUD API для матчей, новостей, игроков, турнирной таблицы, галереи
- Защита маршрутов middleware по ролям

## Установка

### 1. MongoDB

Нужна запущенная MongoDB. Варианты:

**A. Локально:** [Скачать MongoDB Community](https://www.mongodb.com/try/download/community)

**B. Через Docker:**
```bash
docker-compose up -d
```

**C. MongoDB Atlas (облако):**
1. Зарегистрируйся на [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Создай бесплатный кластер
3. Получи URI вида `mongodb+srv://...`
4. Вставь его в `server/.env` в поле `MONGODB_URI`

### 2. Запуск сервера

```bash
cd server
npm install
npm run seed   # загрузить начальные данные + админа
npm run dev    # запуск в режиме разработки (nodemon)
```

Сервер будет на `http://localhost:5000`

### Данные администратора

Email: admin@ledokol-grodno.by
Пароль: Ledokol2026!Admin

## API Endpoints

### Auth
- `POST /api/auth/register` — регистрация
- `POST /api/auth/login` — вход
- `GET /api/auth/me` — текущий пользователь (требует токен)
- `PUT /api/auth/notifications` — настройки уведомлений
- `PUT /api/auth/profile` — профиль игрока/тренера
- `GET /api/auth/club-members` — игроки и тренеры (админ)
- `PUT /api/auth/:id/role` — назначить роль (админ)

### Notifications
- `POST /api/notifications/training-schedule` — рассылка игрокам (админ)
- `POST /api/notifications/match-schedule` — рассылка фанатам (админ)

### Matches
- `GET /api/matches` — все матчи
- `GET /api/matches/next` — следующий матч
- `POST /api/matches` — создать (admin)
- `PUT /api/matches/:id` — обновить (admin)
- `DELETE /api/matches/:id` — удалить (admin)

### News
- `GET /api/news` — все новости
- `GET /api/news/:id` — одна новость
- `POST /api/news` — создать (admin)
- `PUT /api/news/:id` — обновить (admin)
- `DELETE /api/news/:id` — удалить (admin)

### Players
- `GET /api/players` — все игроки
- `GET /api/players/:id` — один игрок
- `POST /api/players` — создать (admin)
- `PUT /api/players/:id` — обновить (admin)
- `DELETE /api/players/:id` — удалить (admin)

### Standings
- `GET /api/standings` — турнирная таблица
- `POST /api/standings` — создать (admin)
- `PUT /api/standings/:id` — обновить (admin)
- `DELETE /api/standings/:id` — удалить (admin)

### Gallery
- `GET /api/gallery` — все фото
- `POST /api/gallery` — добавить (admin)
- `DELETE /api/gallery/:id` — удалить (admin)

## Переменные окружения

Создай файл `server/.env`:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/hockey_club
JWT_SECRET=your_secret_key

# Email уведомления (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
FRONTEND_URL=http://localhost:5173
```

### Настройка SMTP для Gmail:
1. Включи двухфакторную аутентификацию
2. Создай пароль приложения: https://myaccount.google.com/apppasswords
3. Используй этот пароль в `SMTP_PASS`

## Роли пользователей

| Роль | Описание | Уведомления |
|------|----------|-------------|
| `guest` | Гость (без аккаунта) | — |
| `user1` | Пользователь 1 уровня (игроки/тренеры) | Тренировки + матчи |
| `user2` | Пользователь 2 уровня (фанаты, роль по умолчанию) | Матчи + билеты |
| `admin` | Администратор | Все + управление |

## Назначение ролей

Через админ-панель (веб-интерфейс):
1. Войди как администратор
2. Перейди в раздел "Пользователи"
3. Выбери роль для каждого пользователя

Через API:
```bash
PUT /api/auth/:id/role
Headers: Authorization: Bearer <admin_token>
Body: { "role": "user1" }
```

Доступные роли: `user1`, `user2`, `admin`
