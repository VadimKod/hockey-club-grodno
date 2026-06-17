import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Calendar, Trophy, Home, Plane } from "lucide-react";
import { api } from "../../services/api";
function Schedule() {
  const navigate = useNavigate();
  const [matches, setMatches] = useState([]);
  const [nextMatch, setNextMatch] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    Promise.all([api.getMatches(), api.getNextMatch()])
      .then(([allMatches, next]) => {
        setMatches(allMatches.filter(m => !m.isNext));
        setNextMatch(next);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);
  if (loading) {
    return (
      <div className="pt-24 pb-12 px-4 text-center">
        <div className="text-white/50">Загрузка расписания...</div>
      </div>
    );
  }
  return (
    <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-white">
            Расписание <span className="text-gradient">матчей</span>
          </h1>
          <p className="text-white/50 mt-4 max-w-xl">
            Следите за предстоящими играми и результатами команды.
          </p>
        </motion.div>
        {}
        {nextMatch && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass rounded-2xl p-6 sm:p-8 mb-8 glow-red"
          >
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-5 h-5 text-accent-400" />
              <span className="text-accent-400 font-semibold text-sm uppercase tracking-wider">
                Следующий матч
              </span>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-brand-800 to-brand-900 flex items-center justify-center text-2xl border border-white/10">
                  {nextMatch.homeLogo}
                </div>
                <div>
                  <p className="text-white font-bold text-lg">{nextMatch.homeTeam}</p>
                  <p className="text-white/40 text-sm">{nextMatch.arena}</p>
                </div>
              </div>
              <div className="text-center">
                <p className="font-display text-3xl font-bold text-accent-400">VS</p>
                <p className="text-white/50 text-sm mt-1">{nextMatch.date}, {nextMatch.time}</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-white font-bold text-lg">{nextMatch.awayTeam}</p>
                  <p className="text-white/40 text-sm">Гость</p>
                </div>
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-brand-800 to-brand-900 flex items-center justify-center text-2xl border border-white/10">
                  {nextMatch.awayLogo}
                </div>
              </div>
            </div>
          </motion.div>
        )}
        {}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="glass rounded-2xl overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5 text-white/50 text-xs uppercase tracking-wider">
                  <th className="px-6 py-4 text-left font-medium">Дата</th>
                  <th className="px-6 py-4 text-left font-medium">Соперник</th>
                  <th className="px-6 py-4 text-center font-medium">Тип</th>
                  <th className="px-6 py-4 text-center font-medium">Результат</th>
                </tr>
              </thead>
              <tbody>
                {matches.map((m, i) => (
                  <motion.tr
                    key={m._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                    onClick={() => m._id && navigate(`/match/${m._id}`)}
                    className="border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer"
                  >
                    <td className="px-6 py-4 text-white/70">{m.date}</td>
                    <td className="px-6 py-4 text-white font-medium">{m.opponent}</td>
                    <td className="px-6 py-4 text-center">
                      {m.isHome ? (
                        <span className="inline-flex items-center gap-1 text-accent-400 text-xs font-semibold">
                          <Home className="w-3.5 h-3.5" /> Дома
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-white/40 text-xs font-semibold">
                          <Plane className="w-3.5 h-3.5" /> В гостях
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/5 text-white font-display font-bold">
                        <Trophy className="w-3.5 h-3.5 text-yellow-400" />
                        {m.result}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
export default Schedule;