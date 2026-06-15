import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, MapPin, Clock, ArrowRight } from "lucide-react";
import { api } from "../../services/api";

function NextMatch() {
  const [nextMatch, setNextMatch] = useState(null);

  useEffect(() => {
    api.getNextMatch().then(setNextMatch).catch(console.error);
  }, []);

  if (!nextMatch) {
    return (
      <section id="matches" className="py-20 px-4 text-center">
        <div className="text-white/50">Загрузка...</div>
      </section>
    );
  }

  return (
    <section id="matches" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="glass rounded-3xl p-8 sm:p-12 glow-red relative overflow-hidden"
        >
          {/* Background accent */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent-500/5 rounded-full blur-[80px]" />

          <div className="relative z-10">
            <div className="flex items-center justify-center gap-2 mb-8">
              <span className="w-2 h-2 rounded-full bg-accent-500 animate-pulse" />
              <span className="text-accent-400 text-sm font-semibold uppercase tracking-wider">
                Следующий матч
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-16">
              {/* Home team */}
              <div className="flex flex-col items-center gap-3">
                <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl bg-gradient-to-br from-brand-800 to-brand-900 border border-white/10 flex items-center justify-center text-4xl sm:text-5xl shadow-xl">
                  {nextMatch.homeLogo}
                </div>
                <span className="font-display text-xl sm:text-2xl font-bold text-white">
                  {nextMatch.homeTeam}
                </span>
              </div>

              {/* VS & Info */}
              <div className="flex flex-col items-center gap-4">
                <span className="font-display text-4xl sm:text-6xl font-bold text-gradient-red">
                  VS
                </span>
                <div className="flex flex-col items-center gap-2 text-white/60 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{nextMatch.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{nextMatch.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>{nextMatch.arena}</span>
                  </div>
                </div>
              </div>

              {/* Away team */}
              <div className="flex flex-col items-center gap-3">
                <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl bg-gradient-to-br from-brand-800 to-brand-900 border border-white/10 flex items-center justify-center text-4xl sm:text-5xl shadow-xl">
                  {nextMatch.awayLogo}
                </div>
                <span className="font-display text-xl sm:text-2xl font-bold text-white">
                  {nextMatch.awayTeam}
                </span>
              </div>
            </div>

            <div className="mt-10 flex justify-center">
              <button className="group flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium transition-all hover:scale-105">
                Подробнее о матче
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default NextMatch;
