import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { api } from '../../services/api';
import toast from 'react-hot-toast';
import { Edit2, Trash2, Plus, X, Image, Save } from 'lucide-react';
export default function Admin() {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const [news, setNews] = useState([]);
  const [players, setPlayers] = useState([]);
  const [matches, setMatches] = useState([]);
  const [standings, setStandings] = useState([]);
  const [users, setUsers] = useState([]);
  const [tab, setTab] = useState('news');
  const [editing, setEditing] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [sendingNotification, setSendingNotification] = useState(false);
  const [uploadKey, setUploadKey] = useState(0); // Для сброса input file
  const [newsForm, setNewsForm] = useState({ title: '', date: '', category: '', excerpt: '', content: '', image: '' });
  const [playerForm, setPlayerForm] = useState({ name: '', number: '', position: '', stats: '', image: '', bio: '', birthDate: '', height: '', weight: '', country: 'Беларусь', goals: 0, assists: 0, games: 0, penaltyMinutes: 0 });
  const [matchForm, setMatchForm] = useState({ opponent: '', awayTeam: '', date: '', result: '', isHome: true });
  const [standingForm, setStandingForm] = useState({ pos: '', team: '', gp: 0, w: 0, ot: 0, l: 0, gf: 0, ga: 0, pts: 0 });
  useEffect(() => {
    if (!loading && (!user || !isAdmin)) navigate('/login');
  }, [user, isAdmin, loading, navigate]);
  useEffect(() => {
    if (isAdmin) refreshAll();
  }, [isAdmin]);
  useEffect(() => {
    if (tab === 'users' && isAdmin) {
      const apiUrl = import.meta.env.VITE_API_URL || (window.location.hostname === 'localhost' ? 'http://localhost:5000/api' : '/api');
      fetch(`${apiUrl}/auth/level1-users`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      })
        .then(res => res.json())
        .then(data => {
          fetch(`${apiUrl}/auth/all-users`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
          })
            .then(res2 => res2.json())
            .then(allUsers => {
              const uniqueUsers = [];
              const map = new Map();
              [...data, ...allUsers].forEach(user => {
                if(!map.has(user._id)){
                  map.set(user._id, true);
                  uniqueUsers.push(user);
                }
              });
              setUsers(uniqueUsers);
            })
            .catch(() => setUsers(data));
        })
        .catch(() => {});
    }
  }, [tab, isAdmin]);
  const refreshAll = () => {
    api.getNews().then(setNews).catch(() => {});
    api.getPlayers().then(setPlayers).catch(() => {});
    api.getMatches().then(setMatches).catch(() => {});
    api.getStandings().then(setStandings).catch(() => {});
  };
  const sendNotification = async (type) => {
    if (sendingNotification) return; // Защита от двойного нажатия
    if (!window.confirm(`Отправить рассылку "${type === 'training' ? 'пользователям 1 уровня' : 'пользователям 2 уровня'}"?`)) return;
    setSendingNotification(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || (window.location.hostname === 'localhost' ? 'http://localhost:5000/api' : '/api');
      const response = await fetch(`${apiUrl}/notifications/${type === 'training' ? 'training-schedule' : 'match-schedule'}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Ошибка сервера');
      }
      if (data.sent === 0) {
        toast.warning('Нет пользователей с включёнными уведомлениями');
      } else {
        toast.success(`Рассылка отправлена! ${data.sent}/${data.total} получателей`);
      }
    } catch (err) {
      console.error('Ошибка рассылки:', err);
      toast.error(err.message || 'Ошибка отправки рассылки. Проверьте настройки SMTP.');
    } finally {
      setSendingNotification(false);
    }
  };
  const handleUpload = async (file, setter, formKey) => {
    if (!file) return;
    setUploading(true);
    try {
      const res = await api.uploadImage(file);
      const imageUrl = window.location.hostname === 'localhost' 
        ? `http://localhost:5000${res.url}` 
        : res.url;
      setter(prev => ({ ...prev, [formKey]: imageUrl }));
      setUploadKey(k => k + 1); // Сброс input file
      toast.success('Изображение загружено');
    } catch (err) {
      toast.error(err.message || 'Ошибка загрузки');
    } finally {
      setUploading(false);
    }
  };
  const resetNews = () => { setNewsForm({ title: '', date: '', category: '', excerpt: '', content: '', image: '' }); setEditing(null); };
  const handleSaveNews = async (e) => {
    e.preventDefault();
    try {
      if (editing) await api.updateNews(editing, newsForm);
      else await api.createNews(newsForm);
      resetNews();
      api.getNews().then(setNews);
      toast.success(editing ? 'Новость обновлена' : 'Новость добавлена');
    } catch (err) { toast.error(err.message); }
  };
  const handleDeleteNews = async (id) => {
    if (!window.confirm('Удалить новость?')) return;
    try { await api.deleteNews(id); api.getNews().then(setNews); toast.success('Новость удалена'); }
    catch (err) { toast.error(err.message); }
  };
  const startEditNews = (item) => { setEditing(item._id); setNewsForm({ title: item.title, date: item.date, category: item.category, excerpt: item.excerpt, content: item.content || '', image: item.image || '' }); };
  const resetPlayer = () => { setPlayerForm({ name: '', number: '', position: '', stats: '', image: '', bio: '', birthDate: '', height: '', weight: '', country: 'Беларусь', goals: 0, assists: 0, games: 0, penaltyMinutes: 0 }); setEditing(null); };
  const handleSavePlayer = async (e) => {
    e.preventDefault();
    try {
      const data = { ...playerForm, number: Number(playerForm.number), height: Number(playerForm.height) || 0, weight: Number(playerForm.weight) || 0, goals: Number(playerForm.goals) || 0, assists: Number(playerForm.assists) || 0, games: Number(playerForm.games) || 0, penaltyMinutes: Number(playerForm.penaltyMinutes) || 0 };
      if (editing) await api.updatePlayer(editing, data);
      else await api.createPlayer(data);
      resetPlayer();
      api.getPlayers().then(setPlayers);
      toast.success(editing ? 'Игрок обновлён' : 'Игрок добавлен');
    } catch (err) { toast.error(err.message); }
  };
  const handleDeletePlayer = async (id) => {
    if (!window.confirm('Удалить игрока?')) return;
    try { await api.deletePlayer(id); api.getPlayers().then(setPlayers); toast.success('Игрок удалён'); }
    catch (err) { toast.error(err.message); }
  };
  const startEditPlayer = (item) => { setEditing(item._id); setPlayerForm({ name: item.name, number: item.number, position: item.position, stats: item.stats, image: item.image || '', bio: item.bio || '', birthDate: item.birthDate || '', height: item.height || '', weight: item.weight || '', country: item.country || 'Беларусь', goals: item.goals || 0, assists: item.assists || 0, games: item.games || 0, penaltyMinutes: item.penaltyMinutes || 0 }); };
  const resetMatch = () => { setMatchForm({ opponent: '', awayTeam: '', date: '', result: '', isHome: true }); setEditing(null); };
  const handleSaveMatch = async (e) => {
    e.preventDefault();
    try {
      const data = { ...matchForm, homeTeam: 'Ледокол Гродно', homeLogo: '⚡', awayLogo: '🏒', isNext: false };
      if (editing) await api.updateMatch(editing, data);
      else await api.createMatch(data);
      resetMatch();
      api.getMatches().then(setMatches);
      toast.success(editing ? 'Матч обновлён' : 'Матч добавлен');
    } catch (err) { toast.error(err.message); }
  };
  const handleDeleteMatch = async (id) => {
    if (!window.confirm('Удалить матч?')) return;
    try { await api.deleteMatch(id); api.getMatches().then(setMatches); toast.success('Матч удалён'); }
    catch (err) { toast.error(err.message); }
  };
  const startEditMatch = (item) => { setEditing(item._id); setMatchForm({ opponent: item.opponent, awayTeam: item.awayTeam, date: item.date, result: item.result || '', isHome: item.isHome }); };
  const resetStanding = () => { setStandingForm({ pos: '', team: '', gp: 0, w: 0, ot: 0, l: 0, gf: 0, ga: 0, pts: 0 }); setEditing(null); };
  const handleSaveStanding = async (e) => {
    e.preventDefault();
    try {
      const data = { pos: Number(standingForm.pos), team: standingForm.team, gp: Number(standingForm.gp), w: Number(standingForm.w), ot: Number(standingForm.ot), l: Number(standingForm.l), gf: Number(standingForm.gf), ga: Number(standingForm.ga), pts: Number(standingForm.pts) };
      if (editing) await api.updateStanding(editing, data);
      else await api.createStanding(data);
      resetStanding();
      api.getStandings().then(setStandings);
      toast.success(editing ? 'Запись обновлена' : 'Запись добавлена');
    } catch (err) { toast.error(err.message); }
  };
  const handleDeleteStanding = async (id) => {
    if (!window.confirm('Удалить запись?')) return;
    try { await api.deleteStanding(id); api.getStandings().then(setStandings); toast.success('Запись удалена'); }
    catch (err) { toast.error(err.message); }
  };
  const startEditStanding = (item) => { setEditing(item._id); setStandingForm({ pos: item.pos, team: item.team, gp: item.gp, w: item.w, ot: item.ot, l: item.l, gf: item.gf, ga: item.ga, pts: item.pts }); };
  if (loading) return <div className="text-center mt-20">Загрузка...</div>;
  if (!isAdmin) return null;
  const tabs = [
    { key: 'news', label: 'Новости' },
    { key: 'players', label: 'Игроки' },
    { key: 'matches', label: 'Матчи' },
    { key: 'standings', label: 'Таблица' },
    { key: 'users', label: 'Пользователи' },
    { key: 'notifications', label: 'Рассылки' },
  ];
  return (
    <>
      <Helmet><title>Админ-панель | Ледокол Гродно</title></Helmet>
      <div className="max-w-6xl mx-auto mt-10 p-6">
        <h1 className="text-3xl font-bold mb-8">Админ-панель</h1>
        <div className="flex flex-wrap gap-2 mb-6">
          {tabs.map((t) => (
            <button key={t.key} onClick={() => { setTab(t.key); setEditing(null); }} className={`px-4 py-2 rounded-lg ${tab === t.key ? 'bg-blue-600' : 'bg-brand-900 hover:bg-brand-800'}`}>
              {t.label}
            </button>
          ))}
        </div>
        {}
        {tab === 'news' && (
          <div className="space-y-6">
            <form onSubmit={handleSaveNews} className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-brand-900 p-4 rounded-xl">
              <input placeholder="Заголовок" className="p-3 rounded bg-brand-950 border border-brand-800" value={newsForm.title} onChange={e => setNewsForm({ ...newsForm, title: e.target.value })} required />
              <input placeholder="Дата" className="p-3 rounded bg-brand-950 border border-brand-800" value={newsForm.date} onChange={e => setNewsForm({ ...newsForm, date: e.target.value })} required />
              <input placeholder="Категория" className="p-3 rounded bg-brand-950 border border-brand-800" value={newsForm.category} onChange={e => setNewsForm({ ...newsForm, category: e.target.value })} required />
              <div className="flex items-center gap-2">
                <input type="file" accept="image}
        {tab === 'players' && (
          <div className="space-y-6">
            <form onSubmit={handleSavePlayer} className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-brand-900 p-4 rounded-xl">
              <input placeholder="Имя" className="p-3 rounded bg-brand-950 border border-brand-800" value={playerForm.name} onChange={e => setPlayerForm({ ...playerForm, name: e.target.value })} required />
              <input placeholder="Номер" type="number" className="p-3 rounded bg-brand-950 border border-brand-800" value={playerForm.number} onChange={e => setPlayerForm({ ...playerForm, number: e.target.value })} required />
              <input placeholder="Позиция" className="p-3 rounded bg-brand-950 border border-brand-800" value={playerForm.position} onChange={e => setPlayerForm({ ...playerForm, position: e.target.value })} required />
              <input placeholder="Статистика" className="p-3 rounded bg-brand-950 border border-brand-800" value={playerForm.stats} onChange={e => setPlayerForm({ ...playerForm, stats: e.target.value })} required />
              <input placeholder="Рост (см)" type="number" className="p-3 rounded bg-brand-950 border border-brand-800" value={playerForm.height} onChange={e => setPlayerForm({ ...playerForm, height: e.target.value })} />
              <input placeholder="Вес (кг)" type="number" className="p-3 rounded bg-brand-950 border border-brand-800" value={playerForm.weight} onChange={e => setPlayerForm({ ...playerForm, weight: e.target.value })} />
              <input placeholder="Дата рождения" className="p-3 rounded bg-brand-950 border border-brand-800" value={playerForm.birthDate} onChange={e => setPlayerForm({ ...playerForm, birthDate: e.target.value })} />
              <input placeholder="Страна" className="p-3 rounded bg-brand-950 border border-brand-800" value={playerForm.country} onChange={e => setPlayerForm({ ...playerForm, country: e.target.value })} />
              <div className="flex items-center gap-2">
                <input key={uploadKey} type="file" accept="image}
        {tab === 'matches' && (
          <div className="space-y-6">
            <form onSubmit={handleSaveMatch} className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-brand-900 p-4 rounded-xl">
              <input placeholder="Соперник" className="p-3 rounded bg-brand-950 border border-brand-800" value={matchForm.opponent} onChange={e => setMatchForm({ ...matchForm, opponent: e.target.value, awayTeam: e.target.value })} required />
              <input placeholder="Дата" className="p-3 rounded bg-brand-950 border border-brand-800" value={matchForm.date} onChange={e => setMatchForm({ ...matchForm, date: e.target.value })} required />
              <input placeholder="Результат (например: 5:2)" className="p-3 rounded bg-brand-950 border border-brand-800" value={matchForm.result} onChange={e => setMatchForm({ ...matchForm, result: e.target.value })} />
              <select className="p-3 rounded bg-brand-950 border border-brand-800 text-white" value={matchForm.isHome} onChange={e => setMatchForm({ ...matchForm, isHome: e.target.value === 'true' })}>
                <option value="true">Дома</option>
                <option value="false">В гостях</option>
              </select>
              <div className="md:col-span-2 flex gap-2">
                <button type="submit" className="flex-1 p-3 bg-green-600 hover:bg-green-700 rounded-lg font-semibold flex items-center justify-center gap-2">
                  <Save className="w-4 h-4" /> {editing ? 'Сохранить' : 'Добавить'}
                </button>
                {editing && <button type="button" onClick={resetMatch} className="px-4 py-3 bg-white/10 hover:bg-white/20 rounded-lg"><X className="w-4 h-4" /></button>}
              </div>
            </form>
            <div className="space-y-3">
              {matches.filter(m => !m.isNext).map((m) => (
                <div key={m._id} className="flex justify-between items-center bg-brand-900 p-4 rounded-lg">
                  <div>
                    <h3 className="font-semibold">{m.homeTeam} vs {m.awayTeam}</h3>
                    <p className="text-sm text-gray-400">{m.date} · {m.result || '—'} · {m.isHome ? 'Дома' : 'В гостях'}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={(e) => { e.stopPropagation(); startEditMatch(m); }} className="p-2 bg-blue-600/20 hover:bg-blue-600/40 text-blue-400 rounded-lg"><Edit2 className="w-4 h-4" /></button>
                    <button onClick={(e) => { e.stopPropagation(); handleDeleteMatch(m._id); }} className="p-2 bg-red-600/20 hover:bg-red-600/40 text-red-400 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {}
        {tab === 'standings' && (
          <div className="space-y-6">
            <form onSubmit={handleSaveStanding} className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-brand-900 p-4 rounded-xl">
              <input placeholder="Позиция" type="number" className="p-3 rounded bg-brand-950 border border-brand-800" value={standingForm.pos} onChange={e => setStandingForm({ ...standingForm, pos: e.target.value })} required />
              <input placeholder="Команда" className="p-3 rounded bg-brand-950 border border-brand-800" value={standingForm.team} onChange={e => setStandingForm({ ...standingForm, team: e.target.value })} required />
              <input placeholder="Игры" type="number" className="p-3 rounded bg-brand-950 border border-brand-800" value={standingForm.gp} onChange={e => setStandingForm({ ...standingForm, gp: e.target.value })} />
              <input placeholder="Победы" type="number" className="p-3 rounded bg-brand-950 border border-brand-800" value={standingForm.w} onChange={e => setStandingForm({ ...standingForm, w: e.target.value })} />
              <input placeholder="ОТ" type="number" className="p-3 rounded bg-brand-950 border border-brand-800" value={standingForm.ot} onChange={e => setStandingForm({ ...standingForm, ot: e.target.value })} />
              <input placeholder="Поражения" type="number" className="p-3 rounded bg-brand-950 border border-brand-800" value={standingForm.l} onChange={e => setStandingForm({ ...standingForm, l: e.target.value })} />
              <input placeholder="ШЗ" type="number" className="p-3 rounded bg-brand-950 border border-brand-800" value={standingForm.gf} onChange={e => setStandingForm({ ...standingForm, gf: e.target.value })} />
              <input placeholder="ШП" type="number" className="p-3 rounded bg-brand-950 border border-brand-800" value={standingForm.ga} onChange={e => setStandingForm({ ...standingForm, ga: e.target.value })} />
              <input placeholder="Очки" type="number" className="p-3 rounded bg-brand-950 border border-brand-800" value={standingForm.pts} onChange={e => setStandingForm({ ...standingForm, pts: e.target.value })} />
              <div className="col-span-2 md:col-span-4 flex gap-2">
                <button type="submit" className="flex-1 p-3 bg-green-600 hover:bg-green-700 rounded-lg font-semibold flex items-center justify-center gap-2">
                  <Save className="w-4 h-4" /> {editing ? 'Сохранить' : 'Добавить'}
                </button>
                {editing && <button type="button" onClick={resetStanding} className="px-4 py-3 bg-white/10 hover:bg-white/20 rounded-lg"><X className="w-4 h-4" /></button>}
              </div>
            </form>
            <div className="space-y-3">
              {standings.map((s) => (
                <div key={s._id} className="flex justify-between items-center bg-brand-900 p-4 rounded-lg">
                  <div>
                    <h3 className="font-semibold">{s.pos}. {s.team}</h3>
                    <p className="text-sm text-gray-400">И:{s.gp} В:{s.w} ОТ:{s.ot} П:{s.l} · {s.pts} очков</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={(e) => { e.stopPropagation(); startEditStanding(s); }} className="p-2 bg-blue-600/20 hover:bg-blue-600/40 text-blue-400 rounded-lg"><Edit2 className="w-4 h-4" /></button>
                    <button onClick={(e) => { e.stopPropagation(); handleDeleteStanding(s._id); }} className="p-2 bg-red-600/20 hover:bg-red-600/40 text-red-400 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {}
        {tab === 'users' && (
          <div className="space-y-6">
            <div className="bg-brand-900 p-6 rounded-xl">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Управление пользователями</h3>
                  <p className="text-white/50 text-sm">Назначение ролей и управление доступом</p>
                </div>
                <div className="px-4 py-2 bg-accent-500/20 rounded-lg">
                  <span className="text-accent-400 font-bold">{users.length}</span>
                  <span className="text-white/50 text-sm ml-2">пользователей</span>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-brand-950 p-4 rounded-xl">
                  <div className="text-2xl font-bold text-blue-400">{users.filter(u => u.role === 'user2').length}</div>
                  <div className="text-white/50 text-sm">Фанаты</div>
                </div>
                <div className="bg-brand-950 p-4 rounded-xl">
                  <div className="text-2xl font-bold text-green-400">{users.filter(u => u.role === 'user1').length}</div>
                  <div className="text-white/50 text-sm">Игроки/Тренеры</div>
                </div>
                <div className="bg-brand-950 p-4 rounded-xl">
                  <div className="text-2xl font-bold text-accent-400">{users.filter(u => u.role === 'admin').length}</div>
                  <div className="text-white/50 text-sm">Администраторы</div>
                </div>
              </div>
              <div className="space-y-3">
                {users.length === 0 ? (
                  <div className="text-center py-12 text-white/50">
                    <p>Пользователи не найдены</p>
                  </div>
                ) : (
                  users.map((u) => (
                    <div key={u._id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-brand-950 p-4 rounded-xl hover:bg-brand-950/80 transition-all">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent-500 to-accent-600 flex items-center justify-center text-white font-bold">
                          {u.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-white">{u.name}</p>
                          <p className="text-sm text-white/50">{u.email}</p>
                          <p className="text-xs text-white/30 mt-1">
                            Зарегистрирован: {new Date(u.createdAt).toLocaleDateString('ru-RU')}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 w-full sm:w-auto">
                        <select
                          value={u.role}
                          onChange={async (e) => {
                            const apiUrl = import.meta.env.VITE_API_URL || (window.location.hostname === 'localhost' ? 'http://localhost:5000/api' : '/api');
                            try {
                              const response = await fetch(`${apiUrl}/auth/${u._id}/role`, {
                                method: 'PUT',
                                headers: {
                                  'Content-Type': 'application/json',
                                  'Authorization': `Bearer ${localStorage.getItem('token')}`
                                },
                                body: JSON.stringify({ role: e.target.value })
                              });
                              if (!response.ok) {
                                const err = await response.json();
                                throw new Error(err.message);
                              }
                              setUsers(users.map(user => user._id === u._id ? { ...user, role: e.target.value } : user));
                              toast.success(`Роль пользователя ${u.name} изменена`);
                            } catch (err) {
                              console.error('Ошибка обновления роли:', err);
                              toast.error(err.message || 'Ошибка обновления роли');
                            }
                          }}
                        className="flex-1 sm:flex-none p-2.5 rounded-lg bg-brand-900 border border-brand-800 text-white text-sm focus:border-accent-500 outline-none"
                      >
                        <option value="user2">Фанат</option>
                        <option value="user1">Игрок/Тренер</option>
                        <option value="admin">Администратор</option>
                      </select>
                      <span className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap ${
                        u.role === 'admin' ? 'bg-accent-500/20 text-accent-400 border border-accent-500/30' :
                        u.role === 'user1' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                        'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                      }`}>
                        {u.role === 'admin' ? 'Админ' : u.role === 'user1' ? 'Команда' : 'Фанат'}
                      </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
        {}
        {tab === 'notifications' && (
          <div className="space-y-6">
            <div className="bg-brand-900 p-4 rounded-xl">
              <h3 className="text-lg font-semibold mb-4">Рассылки уведомлений</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {}
                <div className="bg-brand-950 p-4 rounded-xl">
                  <h4 className="font-semibold text-green-400 mb-2">Пользователям 1 уровня</h4>
                  <p className="text-white/50 text-sm mb-4">Расписание тренировок и матчей</p>
                  <button
                    onClick={() => sendNotification('training')}
                    disabled={sendingNotification}
                    className="w-full p-3 bg-green-600 hover:bg-green-700 disabled:bg-green-600/50 rounded-lg font-semibold"
                  >
                    {sendingNotification ? 'Отправка...' : 'Отправить рассылку'}
                  </button>
                </div>
                {}
                <div className="bg-brand-950 p-4 rounded-xl">
                  <h4 className="font-semibold text-blue-400 mb-2">Пользователям 2 уровня</h4>
                  <p className="text-white/50 text-sm mb-4">Предстоящие матчи и события</p>
                  <button
                    onClick={() => sendNotification('match')}
                    disabled={sendingNotification}
                    className="w-full p-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 rounded-lg font-semibold"
                  >
                    {sendingNotification ? 'Отправка...' : 'Отправить рассылку'}
                  </button>
                </div>
              </div>
              <div className="mt-6 bg-brand-950 p-4 rounded-xl">
                <h4 className="font-semibold mb-2">Информация</h4>
                <ul className="text-white/50 text-sm space-y-1">
                  <li>• Пользователи 1 уровня получают: расписание тренировок и матчей</li>
                  <li>• Пользователи 2 уровня получают: уведомления о матчах и заказанных билетах</li>
                  <li>• Email должен быть настроен в .env файле (SMTP_USER, SMTP_PASS)</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
