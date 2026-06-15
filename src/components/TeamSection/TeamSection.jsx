import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Shield, Loader2 } from "lucide-react";
import { api } from "../../services/api";
import { players as localPlayers } from "../../data/players";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const item = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5 } },
};

function TeamSection() {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.getPlayers()
      .then((data) => {
        if (data && data.length > 0) {
          setPlayers(data);
        } else {
          setPlayers(localPlayers);
        }
      })
      .catch(() => setPlayers(localPlayers))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section id="team" className="py-24 px-4 text-center">
        <Loader2 className="w-8 h-8 animate-spin text-accent-400 mx-auto" />
        <p className="text-white/50 mt-4">Загрузка состава...</p>
      </section>
    );
  }

  return (
    <section id="team" className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <span className="text-accent-400 text-sm font-semibold uppercase tracking-wider">
            Состав
          </span>
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-white mt-2">
            Наша <span className="text-gradient">команда</span>
          </h2>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {players.map((p) => (
            <motion.div
              key={p._id || p.id}
              variants={item}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              onClick={() => p._id && navigate(`/player/${p._id}`)}
              className="group glass rounded-2xl overflow-hidden cursor-pointer"
            >
              <div className="relative aspect-[3/4] bg-gradient-to-b from-brand-800 to-brand-950 overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Shield className="w-20 h-20 text-white/5" />
                </div>
                <div className="absolute top-4 right-4 w-12 h-12 rounded-xl bg-accent-500/90 flex items-center justify-center shadow-lg">
                  <span className="font-display text-xl font-bold text-white">
                    {p.number}
                  </span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-brand-950 via-brand-950/80 to-transparent">
                  <span className="text-accent-400 text-xs font-semibold uppercase tracking-wider">
                    {p.position}
                  </span>
                  <h3 className="font-display text-xl font-bold text-white mt-1">
                    {p.name}
                  </h3>
                </div>
              </div>
              <div className="p-4 border-t border-white/5">
                <p className="text-white/50 text-sm">{p.stats}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export default TeamSection;
