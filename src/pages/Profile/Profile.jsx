import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { User, Ticket, LogOut, Bell, Users, Shield } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../services/api";
export default function Profile() {
  const { user, logout, isUserLevel1, isUserLevel2, isAdmin, updateNotifications } = useAuth();
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [notifications, setNotifications] = useState({
    trainingSchedule: true,
    matchSchedule: true,
    ticketUpdates: true
  });
  const [saving, setSaving] = useState(false);
  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    api.getMyTickets().then(setTickets).catch(() => {});
    if (user.notifications) {
      setNotifications(user.notifications);
    }
  }, [user, navigate]);
  if (!user) return null;
  const handleNotificationChange = async (key) => {
    const newValue = !notifications[key];
    setNotifications(prev => ({ ...prev, [key]: newValue }));
    setSaving(true);
    try {
      await updateNotifications({ [key]: newValue });
    } catch (err) {
      setNotifications(prev => ({ ...prev, [key]: !newValue }));
    } finally {
      setSaving(false);
    }
  };
  const getRoleBadge = () => {
    if (isAdmin) return { bg: 'bg-accent-500/20', text: 'text-accent-400', label: 'Администратор', icon: Shield };
    if (isUserLevel1) return { bg: 'bg-green-500/20', text: 'text-green-400', label: 'Пользователь 1 уровня', icon: Users };
    if (isUserLevel2) return { bg: 'bg-blue-500/20', text: 'text-blue-400', label: 'Пользователь 2 уровня', icon: Users };
    return { bg: 'bg-white/5', text: 'text-white/40', label: 'Гость', icon: User };
  };
  const roleBadge = getRoleBadge();
  const RoleIcon = roleBadge.icon;
  return (
    <>
      <Helmet>
        <title>Личный кабинет | Ледокол Гродно</title>
      </Helmet>
      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="glass rounded-2xl p-8 mb-8">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-accent-500/20 flex items-center justify-center">
                    <User className="w-8 h-8 text-accent-400" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-white">{user.name}</h1>
                    <p className="text-white/50">{user.email}</p>
                    <span className={`inline-block mt-1 px-2 py-0.5 rounded text-xs font-semibold ${roleBadge.bg} ${roleBadge.text}`}>
                      <RoleIcon className="w-3 h-3 inline mr-1" />
                      {roleBadge.label}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => { logout(); navigate("/"); }}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors text-sm"
                >
                  <LogOut className="w-4 h-4" /> Выйти
                </button>
              </div>
            </div>
            {}
            <div className="glass rounded-2xl p-8 mb-8">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Bell className="w-5 h-5 text-accent-400" />
                Уведомления
              </h2>
              <div className="space-y-4">
                {}
                {isUserLevel1 && (
                  <div className="flex items-center justify-between bg-brand-950 rounded-xl p-4">
                    <div>
                      <p className="text-white font-semibold">Расписание тренировок</p>
                      <p className="text-white/40 text-sm">Уведомления о тренировках и сборах</p>
                    </div>
                    <button
                      onClick={() => handleNotificationChange('trainingSchedule')}
                      disabled={saving}
                      className={`w-12 h-6 rounded-full transition-colors ${
                        notifications.trainingSchedule ? 'bg-accent-500' : 'bg-white/10'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-full bg-white shadow-sm transform transition-transform ${
                        notifications.trainingSchedule ? 'translate-x-6' : 'translate-x-0.5'
                      }`} />
                    </button>
                  </div>
                )}
                {}
                {user && (
                  <div className="flex items-center justify-between bg-brand-950 rounded-xl p-4">
                    <div>
                      <p className="text-white font-semibold">Расписание матчей</p>
                      <p className="text-white/40 text-sm">Уведомления о предстоящих матчах</p>
                    </div>
                    <button
                      onClick={() => handleNotificationChange('matchSchedule')}
                      disabled={saving}
                      className={`w-12 h-6 rounded-full transition-colors ${
                        notifications.matchSchedule ? 'bg-accent-500' : 'bg-white/10'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-full bg-white shadow-sm transform transition-transform ${
                        notifications.matchSchedule ? 'translate-x-6' : 'translate-x-0.5'
                      }`} />
                    </button>
                  </div>
                )}
                {}
                {isUserLevel2 && (
                  <div className="flex items-center justify-between bg-brand-950 rounded-xl p-4">
                    <div>
                      <p className="text-white font-semibold">Уведомления о билетах</p>
                      <p className="text-white/40 text-sm">Подтверждение заказа и статус билетов</p>
                    </div>
                    <button
                      onClick={() => handleNotificationChange('ticketUpdates')}
                      disabled={saving}
                      className={`w-12 h-6 rounded-full transition-colors ${
                        notifications.ticketUpdates ? 'bg-accent-500' : 'bg-white/10'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-full bg-white shadow-sm transform transition-transform ${
                        notifications.ticketUpdates ? 'translate-x-6' : 'translate-x-0.5'
                      }`} />
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div className="glass rounded-2xl p-8">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Ticket className="w-5 h-5 text-accent-400" />
                Мои билеты
              </h2>
              {tickets.length === 0 ? (
                <p className="text-white/40">У вас пока нет билетов.</p>
              ) : (
                <div className="space-y-3">
                  {tickets.map((t) => (
                    <div key={t._id} className="flex justify-between items-center bg-brand-950 rounded-xl p-4">
                      <div>
                        <p className="text-white font-semibold">{t.name}</p>
                        <p className="text-white/40 text-sm">{t.count} билет(а) · {t.total} BYN</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        t.status === 'paid' ? 'bg-green-500/20 text-green-400' :
                        t.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-red-500/20 text-red-400'
                      }`}>
                        {t.status === 'paid' ? 'Оплачен' : t.status === 'pending' ? 'В обработке' : 'Отменён'}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}
