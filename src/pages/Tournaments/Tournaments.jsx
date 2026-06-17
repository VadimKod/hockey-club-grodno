import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Trophy, Calendar, Award } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { api } from "../../services/api";
export default function Tournaments() {
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    api.getTournaments()
      .then(setTournaments)
      .catch(() => setTournaments([]))
      .finally(() => setLoading(false));
  }, []);
  const statusLabel = (s) => {
    if (s === 'current') return { text: 'Текущий', color: 'bg-green-500/20 text-green-400' };
    if (s === 'finished') return { text: 'Завершён', color: 'bg-white/5 text-white/40' };
    return { text: 'Предстоит', color: 'bg-accent-500/20 text-accent-400' };
  };
  return (
    <>
      <Helmet>
        <title>Турниры | Ледокол Гродно</title>
        <meta name="description" content="Турниры и сезоны хоккейного клуба Ледокол Гродно" />
      </Helmet>
      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h1 className="font-display text-4xl sm:text-5xl font-bold text-white">
              Турниры и <span className="text-gradient">сезоны</span>
            </h1>
          </motion.div>
          <div className="space-y-4">
            {loading ? (
              <p className="text-white/40 text-center py-8">Загрузка...</p>
            ) : tournaments.length === 0 ? (
              <p className="text-white/40 text-center py-8">Турниры пока не добавлены</p>
            ) : (
              tournaments.map((t) => {
              const st = statusLabel(t.status);
              return (
                <motion.div
                  key={t._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="glass rounded-2xl p-6"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-accent-500/20 flex items-center justify-center shrink-0">
                        <Trophy className="w-6 h-6 text-accent-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white">{t.name}</h3>
                        <p className="text-white/50 text-sm">{t.season}</p>
                        <div className="flex items-center gap-4 mt-2 text-white/40 text-sm">
                          <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {t.startDate} — {t.endDate}</span>
                        </div>
                        {t.description && <p className="text-white/40 text-sm mt-2">{t.description}</p>}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {t.finalPlace && (
                        <span className="flex items-center gap-1 text-white/60 text-sm">
                          <Award className="w-4 h-4 text-accent-400" /> {t.finalPlace} место
                        </span>
                      )}
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${st.color}`}>{st.text}</span>
                    </div>
                  </div>
                </motion.div>
              );
            }))}
          </div>
        </div>
      </div>
    </>
  );
}
