import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Trophy } from "lucide-react";
import { api } from "../../services/api";
import { standings as localStandings } from "../../data/standings";

const normalizeStandings = (items) =>
  items.map((item) => ({
    ...item,
    _id: item._id || String(item.id ?? item.pos),
  }));

function Standings() {
  const [standings, setStandings] = useState([]);

  useEffect(() => {
    api.getStandings()
      .then((data) => {
        if (data?.length) setStandings(data);
        else setStandings(normalizeStandings(localStandings));
      })
      .catch(() => setStandings(normalizeStandings(localStandings)));
  }, []);

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <span className="text-accent-400 text-sm font-semibold uppercase tracking-wider">
            Турнирное положение
          </span>
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-white mt-2">
            Турнирная <span className="text-gradient">таблица</span>
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="glass rounded-2xl overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5 text-white/50 text-xs uppercase tracking-wider">
                  <th className="px-4 py-4 text-left font-medium">#</th>
                  <th className="px-4 py-4 text-left font-medium">Команда</th>
                  <th className="px-4 py-4 text-center font-medium">И</th>
                  <th className="px-4 py-4 text-center font-medium">В</th>
                  <th className="px-4 py-4 text-center font-medium">ОТ</th>
                  <th className="px-4 py-4 text-center font-medium">П</th>
                  <th className="px-4 py-4 text-center font-medium">ШЗ</th>
                  <th className="px-4 py-4 text-center font-medium">ШП</th>
                  <th className="px-4 py-4 text-center font-medium">О</th>
                </tr>
              </thead>
              <tbody>
                {standings.map((s, i) => {
                  const isCurrent = s.team === "Ледокол Гродно";
                  return (
                    <motion.tr
                      key={s._id || s.id || s.pos}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.05 }}
                      className={`border-b border-white/5 transition-colors ${
                        isCurrent
                          ? "bg-accent-500/10 hover:bg-accent-500/15"
                          : "hover:bg-white/5"
                      }`}
                    >
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          {s.pos <= 3 && (
                            <Trophy
                              className={`w-4 h-4 ${
                                s.pos === 1
                                  ? "text-yellow-400"
                                  : s.pos === 2
                                  ? "text-gray-300"
                                  : "text-amber-600"
                              }`}
                            />
                          )}
                          <span
                            className={`font-display font-bold ${
                              s.pos <= 3 ? "text-white" : "text-white/60"
                            }`}
                          >
                            {s.pos}
                          </span>
                        </div>
                      </td>
                      <td
                        className={`px-4 py-4 font-semibold ${
                          isCurrent ? "text-accent-400" : "text-white"
                        }`}
                      >
                        {s.team}
                      </td>
                      <td className="px-4 py-4 text-center text-white/70">
                        {s.gp}
                      </td>
                      <td className="px-4 py-4 text-center text-white/70">
                        {s.w}
                      </td>
                      <td className="px-4 py-4 text-center text-white/70">
                        {s.ot}
                      </td>
                      <td className="px-4 py-4 text-center text-white/70">
                        {s.l}
                      </td>
                      <td className="px-4 py-4 text-center text-white/70">
                        {s.gf}
                      </td>
                      <td className="px-4 py-4 text-center text-white/70">
                        {s.ga}
                      </td>
                      <td className="px-4 py-4 text-center">
                        <span
                          className={`font-display font-bold text-lg ${
                            isCurrent ? "text-accent-400" : "text-white"
                          }`}
                        >
                          {s.pts}
                        </span>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default Standings;
