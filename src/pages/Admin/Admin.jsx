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

  // Forms
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
      fetch('http://localhost:5000/api/auth/level1-users', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      })
        .then(res => res.json())
        .then(data => setUsers(data))
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
    if (!window.confirm(`Отправить рассылку "${type === 'training' ? 'пользователям 1 уровня' : 'пользователям 2 уровня'}"?`)) return;
    setSendingNotification(true);
    try {
      await fetch(`http://localhost:5000/api/notifications/${type === 'training' ? 'training-schedule' : 'match-schedule'}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      toast.success('Рассылка отправлена');
    } catch (err) {
      toast.error('Ошибка отправки рассылки');
    } finally {
      setSendingNotification(false);
    }
  };

  const handleUpload = async (file, setter, formKey) => {
    if (!file) return;
    setUploading(true);
    try {
      const res = await api.uploadImage(file);
      setter(prev => ({ ...prev, [formKey]: res.url }));
      toast.success('Изображение загружено');
    } catch (err) {
      toast.error(err.message || 'Ошибка загрузки');
    } finally {
      setUploading(false);
    }
  };

  // News
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

  // Players
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

  // Matches
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

  // Standings
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

        {/* NEWS */}
        {tab === 'news' && (
          <div className="space-y-6">
            <form onSubmit={handleSaveNews} className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-brand-900 p-4 rounded-xl">
              <input placeholder="Заголовок" className="p-3 rounded bg-brand-950 border border-brand-800" value={newsForm.title} onChange={e => setNewsForm({ ...newsForm, title: e.target.value })} required />
              <input placeholder="Дата" className="p-3 rounded bg-brand-950 border border-brand-800" value={newsForm.date} onChange={e => setNewsForm({ ...newsForm, date: e.target.value })} required />
              <input placeholder="Категория" className="p-3 rounded bg-brand-950 border border-brand-800" value={newsForm.category} onChange={e => setNewsForm({ ...newsForm, category: e.target.value })} required />
              <div className="flex items-center gap-2">
                <input type="file" accept="image/*" onChange={e => handleUpload(e.target.files[0], setNewsForm, 'image')} className="hidden" id="news-img" />
                <label htmlFor="news-img" className="flex items-center gap-2 px-3 py-2 rounded bg-brand-950 border border-brand-800 cursor-pointer hover:bg-brand-800 text-sm text-white/70">
                  <Image className="w-4 h-4" /> {newsForm.image ? 'Изменить' : 'Фото'}
                </label>
                {newsForm.image && <span className="text-white/40 text-xs truncate">{newsForm.image.split('/').pop()}</span>}
                {uploading && <span className="text-white/40 text-xs">Загрузка...</span>}
              </div>
              <input placeholder="Краткое описание" className="p-3 rounded bg-brand-950 border border-brand-800 md:col-span-2" value={newsForm.excerpt} onChange={e => setNewsForm({ ...newsForm, excerpt: e.target.value })} required />
              <textarea placeholder="Полный текст (опционально)" className="p-3 rounded bg-brand-950 border border-brand-800 md:col-span-2 text-white" rows={3} value={newsForm.content} onChange={e => setNewsForm({ ...newsForm, content: e.target.value })} />
              <div className="md:col-span-2 flex gap-2">
                <button type="submit" className="flex-1 p-3 bg-green-600 hover:bg-green-700 rounded-lg font-semibold flex items-center justify-center gap-2">
                  <Save className="w-4 h-4" /> {editing ? 'Сохранить' : 'Добавить'}
                </button>
                {editing && <button type="button" onClick={resetNews} className="px-4 py-3 bg-white/10 hover:bg-white/20 rounded-lg"><X className="w-4 h-4" /></button>}
              </div>
            </form>

            <div className="space-y-3">
              {news.map((item) => (
                <div key={item._id} className="flex justify-between items-center bg-brand-900 p-4 rounded-lg">
                  <div className="flex items-center gap-3">
                    {item.image && <img src={item.image} alt="" className="w-12 h-12 rounded-lg object-cover" />}
                    <div>
                      <h3 className="font-semibold">{item.title}</h3>
                      <p className="text-sm text-gray-400">{item.date} · {item.category}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => startEditNews(item)} className="p-2 bg-blue-600/20 hover:bg-blue-600/40 text-blue-400 rounded-lg"><Edit2 className="w-4 h-4" /></button>
                    <button onClick={() => handleDeleteNews(item._id)} className="p-2 bg-red-600/20 hover:bg-red-600/40 text-red-400 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PLAYERS */}
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
                <input type="file" accept="image/*" onChange={e => handleUpload(e.target.files[0], setPlayerForm, 'image')} className="hidden" id="player-img" />
                <label htmlFor="player-img" className="flex items-center gap-2 px-3 py-2 rounded bg-brand-950 border border-brand-800 cursor-pointer hover:bg-brand-800 text-sm text-white/70">
                  <Image className="w-4 h-4" /> {playerForm.image ? 'Изменить' : 'Фото'}
                </label>
              </div>
              <textarea placeholder="Биография" className="p-3 rounded bg-brand-950 border border-brand-800 md:col-span-3 text-white" rows={2} value={playerForm.bio} onChange={e => setPlayerForm({ ...playerForm, bio: e.target.value })} />
              <div className="md:col-span-3 flex gap-2">
                <button type="submit" className="flex-1 p-3 bg-green-600 hover:bg-green-700 rounded-lg font-semibold flex items-center justify-center gap-2">
                  <Save className="w-4 h-4" /> {editing ? 'Сохранить' : 'Добавить'}
                </button>
                {editing && <button type="button" onClick={resetPlayer} className="px-4 py-3 bg-white/10 hover:bg-white/20 rounded-lg"><X className="w-4 h-4" /></button>}
              </div>
            </form>

            <div className="space-y-3">
              {players.map((p) => (
                <div key={p._id} className="flex justify-between items-center bg-brand-900 p-4 rounded-lg">
                  <div className="flex items-center gap-3">
                    {p.image ? <img src={p.image} alt="" className="w-12 h-12 rounded-lg object-cover" /> : <div className="w-12 h-12 rounded-lg bg-brand-800 flex items-center justify-center text-white/30 font-bold">#{p.number}</div>}
                    <div>
                      <h3 className="font-semibold">{p.name}</h3>
                      <p className="text-sm text-gray-400">{p.position} · {p.stats}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => startEditPlayer(p)} className="p-2 bg-blue-600/20 hover:bg-blue-600/40 text-blue-400 rounded-lg"><Edit2 className="w-4 h-4" /></button>
                    <button onClick={() => handleDeletePlayer(p._id)} className="p-2 bg-red-600/20 hover:bg-red-600/40 text-red-400 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MATCHES */}
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
                    <button onClick={() => startEditMatch(m)} className="p-2 bg-blue-600/20 hover:bg-blue-600/40 text-blue-400 rounded-lg"><Edit2 className="w-4 h-4" /></button>
                    <button onClick={() => handleDeleteMatch(m._id)} className="p-2 bg-red-600/20 hover:bg-red-600/40 text-red-400 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STANDINGS */}
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
                    <button onClick={() => startEditStanding(s)} className="p-2 bg-blue-600/20 hover:bg-blue-600/40 text-blue-400 rounded-lg"><Edit2 className="w-4 h-4" /></button>
                    <button onClick={() => handleDeleteStanding(s._id)} className="p-2 bg-red-600/20 hover:bg-red-600/40 text-red-400 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* USERS */}
        {tab === 'users' && (
          <div className="space-y-6">
            <div className="bg-brand-900 p-4 rounded-xl">
              <h3 className="text-lg font-semibold mb-4">Управление пользователями</h3>
              <p className="text-white/50 text-sm mb-4">Назначение ролей: игрок, тренер, фанат, администратор</p>
              <div className="space-y-2">
                {users.map((u) => (
                  <div key={u._id} className="flex justify-between items-center bg-brand-950 p-3 rounded-lg">
                    <div>
                      <p className="font-semibold">{u.name}</p>
                      <p className="text-sm text-white/50">{u.email}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <select
                        value={u.role}
                        onChange={async (e) => {
                          try {
                            await fetch(`http://localhost:5000/api/auth/${u._id}/role`, {
                              method: 'PUT',
                              headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${localStorage.getItem('token')}`
                              },
                              body: JSON.stringify({ role: e.target.value })
                            });
                            setUsers(users.map(user => user._id === u._id ? { ...user, role: e.target.value } : user));
                            toast.success('Роль обновлена');
                          } catch (err) {
                            toast.error('Ошибка обновления роли');
                          }
                        }}
                        className="p-2 rounded bg-brand-900 border border-brand-800 text-white text-sm"
                      >
                        <option value="user2">Пользователь 2 уровня</option>
                        <option value="user1">Пользователь 1 уровня</option>
                        <option value="admin">Админ</option>
                      </select>
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        u.role === 'admin' ? 'bg-accent-500/20 text-accent-400' :
                        u.role === 'user1' ? 'bg-green-500/20 text-green-400' :
                        'bg-blue-500/20 text-blue-400'
                      }`}>
                        {u.role === 'admin' ? 'Админ' : u.role === 'user1' ? 'Пользователь 1 ур.' : 'Пользователь 2 ур.'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* NOTIFICATIONS */}
        {tab === 'notifications' && (
          <div className="space-y-6">
            <div className="bg-brand-900 p-4 rounded-xl">
              <h3 className="text-lg font-semibold mb-4">Рассылки уведомлений</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Для пользователей первого уровня */}
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

                {/* Для пользователей второго уровня */}
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
