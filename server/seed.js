require('dotenv').config();
const connectDB = require('./config/db');
const Match = require('./models/Match');
const News = require('./models/News');
const Player = require('./models/Player');
const Standing = require('./models/Standing');
const User = require('./models/User');
const Tournament = require('./models/Tournament');
const bcrypt = require('bcryptjs');

const seed = async () => {
  try {
    await connectDB();
    console.log('Подключение к базе установлено, начинаю наполнение...');

    await Match.deleteMany();
    await News.deleteMany();
    await Player.deleteMany();
    await Standing.deleteMany();
    await User.deleteMany();
    await Tournament.deleteMany();

    // Админ
    const adminPassword = await bcrypt.hash('Ledokol2026!Admin', 10);
    await User.create({
      name: 'Администратор',
      email: 'admin@ledokol-grodno.by',
      password: adminPassword,
      role: 'admin'
    });
    console.log('Админ создан: admin@ledokol-grodno.by / Ledokol2026!Admin');

    // Следующий матч
    await Match.create({
      homeTeam: 'Ледокол Гродно',
      awayTeam: 'Медведи Витебск',
      opponent: 'Медведи Витебск',
      date: '22 марта 2026',
      time: '19:30',
      arena: 'Ледовый дворец Гродно',
      isHome: true,
      homeLogo: '⚡',
      awayLogo: '🐻',
      isNext: true
    });

    // Матчи
    await Match.create([
      { opponent: 'Барсы Брест', awayTeam: 'Барсы Брест', date: '25.04.2026', result: '5:2', isHome: true },
      { opponent: 'Соколы Минск', awayTeam: 'Соколы Минск', date: '30.04.2026', result: '3:4 ОТ', isHome: false },
      { opponent: 'Волки Могилёв', awayTeam: 'Волки Могилёв', date: '05.05.2026', result: '2:2', isHome: true }
    ]);

    // Новости
    await News.create([
      { title: 'Грандиозная победа в городском дерби', date: '15 марта 2026', category: 'Матч', excerpt: '"Ледокол Гродно" одержал уверенную победу со счётом 5:2 в дерби, продемонстрировав великолепную командную игру и характер.' },
      { title: 'Новый нападающий пополнил состав', date: '12 марта 2026', category: 'Трансфер', excerpt: '22-летний форвард Артём Ковалёв присоединился к "Ледоколу". В прошлом сезоне он забил 34 гола в 48 матчах за фарм-клуб.' },
      { title: 'Реконструкция ледового дворца Гродно завершена', date: '08 марта 2026', category: 'Клуб', excerpt: 'Модернизированный ледовый дворец на 2 500 зрителей открыт после капитального ремонта. Первый матч — против "Барсов".' },
      { title: 'Тренировочный сбор в Буковеле завершён', date: '01 марта 2026', category: 'Тренировки', excerpt: 'Команда успешно завершила двухнедельный предсезонный сбор, отыграв три контрольных матча.' }
    ]);

    // Игроки
    await Player.create([
      { name: 'Иван Кулакович', number: 31, position: 'Вратарь', stats: 'Сухих матчей: 12' },
      { name: 'Артём Демкович', number: 77, position: 'Защитник', stats: 'Голы: 8, Передачи: 24' },
      { name: 'Максим Субботин', number: 44, position: 'Защитник', stats: 'Голы: 5, Передачи: 18' },
      { name: 'Артём Ковалёв', number: 17, position: 'Нападающий', stats: 'Голы: 34, Передачи: 21' },
      { name: 'Евгений Ковалёв', number: 9, position: 'Нападающий', stats: 'Голы: 28, Передачи: 19' },
      { name: 'Никита Феоктистов', number: 88, position: 'Нападающий', stats: 'Голы: 22, Передачи: 31' },
      { name: 'Дмитрий Коробов', number: 23, position: 'Защитник', stats: 'Голы: 3, Передачи: 15' },
      { name: 'Алексей Лучинский', number: 11, position: 'Нападающий', stats: 'Голы: 19, Передачи: 14' }
    ]);

    // Турнирная таблица
    await Standing.create([
      { pos: 1, team: 'Медведи Витебск', gp: 48, w: 35, ot: 5, l: 8, gf: 168, ga: 98, pts: 110 },
      { pos: 2, team: 'Ледокол Гродно', gp: 48, w: 32, ot: 6, l: 10, gf: 154, ga: 102, pts: 102 },
      { pos: 3, team: 'Барсы Брест', gp: 48, w: 29, ot: 7, l: 12, gf: 141, ga: 115, pts: 93 },
      { pos: 4, team: 'Соколы Минск', gp: 48, w: 27, ot: 5, l: 16, gf: 132, ga: 128, pts: 86 },
      { pos: 5, team: 'Волки Могилёв', gp: 48, w: 24, ot: 8, l: 16, gf: 138, ga: 130, pts: 80 },
      { pos: 6, team: 'Ястребы Гомель', gp: 48, w: 20, ot: 6, l: 22, gf: 120, ga: 135, pts: 66 },
      { pos: 7, team: 'Рыси Бобруйск', gp: 48, w: 15, ot: 4, l: 29, gf: 105, ga: 158, pts: 49 },
      { pos: 8, team: 'Бизоны Молодечно', gp: 48, w: 10, ot: 3, l: 35, gf: 89, ga: 172, pts: 33 }
    ]);

    // Турниры
    await Tournament.create([
      { name: 'Кубок Беларуси по хоккею', season: '2025/26', startDate: '2025-09-01', endDate: '2026-04-30', status: 'current', description: 'Ежегодный национальный турнир среди любительских команд.', finalPlace: 2 },
      { name: 'Чемпионат Гродненской области', season: '2024/25', startDate: '2024-10-01', endDate: '2025-03-15', status: 'finished', description: 'Региональный чемпионат. Серебряные призёры.', finalPlace: 2 },
      { name: 'Турнир памяти А.А. Ромащенко', season: '2025/26', startDate: '2025-11-15', endDate: '2025-11-20', status: 'upcoming', description: 'Ежегодный мемориальный турнир в Гродно.' }
    ]);

    console.log('Данные успешно загружены!');
    return true;
  } catch (err) {
    console.error('Seed error:', err);
    throw err;
  }
};

// Если запускается напрямую (node seed.js)
if (require.main === module) {
  seed()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

module.exports = seed;
