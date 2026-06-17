import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Shield, Calendar, Ruler, Weight, MapPin } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { api } from "../../services/api";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
const getImageUrl = (url) => {
  if (!url) return null;
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return window.location.hostname === 'localhost' ? `http://localhost:5000${url}` : url;
};
export default function PlayerDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [player, setPlayer] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    api.getPlayer(id)
      .then((player) => {
        const playerWithImage = { ...player, image: getImageUrl(player.image) };
        setPlayer(playerWithImage);
      })
      .catch(() => navigate("/"))
      .finally(() => setLoading(false));
  }, [id, navigate]);
  if (loading) return <div className="text-center pt-32 text-white/50">Загрузка...</div>;
  if (!player) return null;
  const statsData = [
    { name: "Голы", value: player.goals || 0 },
    { name: "Передачи", value: player.assists || 0 },
    { name: "Игры", value: player.games || 0 },
    { name: "Штраф", value: player.penaltyMinutes || 0 },
  ];
  const COLORS = ["#f59e0b", "#3b82f6", "#10b981", "#ef4444"];
  return (
    <>
      <Helmet>
        <title>#{player.number} {player.name} | Ледокол Гродно</title>
        <meta name="description" content={`${player.position} «Ледокол Гродно». ${player.stats}`} />
      </Helmet>
      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-white/50 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Назад
          </button>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="glass rounded-2xl overflow-hidden"
          >
            <div className="relative bg-gradient-to-b from-brand-800 to-brand-950 p-8 sm:p-12">
              <div className="absolute top-6 right-6 w-20 h-20 rounded-2xl bg-accent-500/90 flex items-center justify-center">
                <span className="font-display text-3xl font-bold text-white">{player.number}</span>
              </div>
              <div className="flex flex-col sm:flex-row items-start gap-6">
                {player.image ? (
                  <img src={player.image} alt={player.name} className="w-32 h-32 rounded-2xl object-cover border-2 border-white/10" />
                ) : (
                  <div className="w-32 h-32 rounded-2xl bg-white/5 flex items-center justify-center">
                    <Shield className="w-16 h-16 text-white/10" />
                  </div>
                )}
                <div>
                  <span className="text-accent-400 text-sm font-semibold uppercase tracking-wider">{player.position}</span>
                  <h1 className="font-display text-3xl sm:text-4xl font-bold text-white mt-1">{player.name}</h1>
                  <p className="text-white/50 mt-2">{player.stats}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
                {player.birthDate && (
                  <div className="flex items-center gap-2 text-white/50 text-sm">
                    <Calendar className="w-4 h-4 text-accent-400" />
                    {player.birthDate}
                  </div>
                )}
                {player.height > 0 && (
                  <div className="flex items-center gap-2 text-white/50 text-sm">
                    <Ruler className="w-4 h-4 text-accent-400" />
                    {player.height} см
                  </div>
                )}
                {player.weight > 0 && (
                  <div className="flex items-center gap-2 text-white/50 text-sm">
                    <Weight className="w-4 h-4 text-accent-400" />
                    {player.weight} кг
                  </div>
                )}
                <div className="flex items-center gap-2 text-white/50 text-sm">
                  <MapPin className="w-4 h-4 text-accent-400" />
                  {player.country}
                </div>
              </div>
            </div>
            {player.bio && (
              <div className="p-8">
                <h3 className="text-lg font-bold text-white mb-3">Биография</h3>
                <p className="text-white/60 leading-relaxed">{player.bio}</p>
              </div>
            )}
            <div className="p-8 border-t border-white/5">
              <h3 className="text-lg font-bold text-white mb-6">Статистика сезона</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={statsData}>
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                    <YAxis stroke="#94a3b8" fontSize={12} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                      labelStyle={{ color: '#fff' }}
                    />
                    <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                      {statsData.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}
