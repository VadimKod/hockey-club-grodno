import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Trophy, Calendar, MapPin, Clock } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { api } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

export default function MatchDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [match, setMatch] = useState(null);
  const [votes, setVotes] = useState([]);
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getMatches()
      .then((matches) => {
        const m = matches.find((x) => x._id === id);
        if (!m) return navigate("/");
        setMatch(m);
        api.getVotes(id).then(setVotes);
        api.getPlayers().then(setPlayers);
      })
      .catch(() => navigate("/"))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const handleVote = async (playerId) => {
    if (!user) return toast.error("Войдите, чтобы голосовать");
    try {
      await api.vote({ matchId: id, playerId });
      api.getVotes(id).then(setVotes);
      toast.success("Голос учтён!");
    } catch (err) {
      toast.error(err.message);
    }
  };

  const getVoteCount = (pid) => votes.find((v) => v._id === pid)?.count || 0;
  const totalVotes = votes.reduce((a, v) => a + v.count, 0);

  if (loading) return <div className="text-center pt-32 text-white/50">Загрузка...</div>;
  if (!match) return null;

  return (
    <>
      <Helmet>
        <title>{match.homeTeam} vs {match.awayTeam} | Ледокол Гродно</title>
        <meta name="description" content={`Матч ${match.homeTeam} против ${match.awayTeam}. ${match.date}, ${match.time}`} />
      </Helmet>
      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
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
            <div className="bg-gradient-to-b from-brand-800 to-brand-950 p-8 text-center">
              <div className="flex items-center justify-center gap-6 mb-6">
                <div className="text-center">
                  <div className="text-4xl">{match.homeLogo || '⚡'}</div>
                  <p className="text-white font-bold mt-2">{match.homeTeam}</p>
                </div>
                <div className="text-3xl font-display font-bold text-white">
                  {match.result || match.isNext ? 'vs' : '—'}
                </div>
                <div className="text-center">
                  <div className="text-4xl">{match.awayLogo || '🏒'}</div>
                  <p className="text-white font-bold mt-2">{match.awayTeam || match.opponent}</p>
                </div>
              </div>

              <div className="flex flex-wrap justify-center gap-4 text-white/50 text-sm">
                <span className="flex items-center gap-1"><Calendar className="w-4 h-4 text-accent-400" /> {match.date}</span>
                {match.time && <span className="flex items-center gap-1"><Clock className="w-4 h-4 text-accent-400" /> {match.time}</span>}
                {match.arena && <span className="flex items-center gap-1"><MapPin className="w-4 h-4 text-accent-400" /> {match.arena}</span>}
              </div>
            </div>

            {/* Voting */}
            <div className="p-8 border-t border-white/5">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-accent-400" />
                Лучший игрок матча
              </h3>
              <p className="text-white/40 text-sm mb-4">{totalVotes} голосов</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {players.map((p) => {
                  const count = getVoteCount(p._id);
                  const pct = totalVotes ? Math.round((count / totalVotes) * 100) : 0;
                  return (
                    <button
                      key={p._id}
                      onClick={() => handleVote(p._id)}
                      className="relative p-4 rounded-xl bg-brand-950 border border-white/5 hover:border-accent-500/50 transition-all text-left"
                    >
                      <div className="text-2xl font-bold text-white">#{p.number}</div>
                      <div className="text-sm text-white/60 mt-1 truncate">{p.name}</div>
                      <div className="mt-2 h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-accent-500 rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                      <div className="text-xs text-white/40 mt-1">{count} ({pct}%)</div>
                    </button>
                  );
                })}
              </div>
              {!user && <p className="text-white/30 text-sm mt-4">Войдите, чтобы проголосовать</p>}
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}
