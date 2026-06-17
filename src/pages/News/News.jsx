import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Calendar, ArrowRight } from "lucide-react";
import { api } from "../../services/api";
import { news as localNews } from "../../data/news";
const getImageUrl = (url) => {
  if (!url) return null;
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return window.location.hostname === 'localhost' ? `http://localhost:5000${url}` : url;
};
const normalizeNews = (items) =>
  items.map((item) => ({
    ...item,
    _id: item._id || String(item.id),
    image: getImageUrl(item.image),
  }));
function News() {
  const navigate = useNavigate();
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    api.getNews()
      .then((data) => {
        if (data?.length) setNews(data);
        else setNews(normalizeNews(localNews));
      })
      .catch(() => setNews(normalizeNews(localNews)))
      .finally(() => setLoading(false));
  }, []);
  if (loading) {
    return (
      <div className="pt-24 pb-12 px-4 text-center">
        <div className="text-white/50">Загрузка новостей...</div>
      </div>
    );
  }
  return (
    <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-white">
            Новости <span className="text-gradient">клуба</span>
          </h1>
          <p className="text-white/50 mt-4 max-w-xl">
            Будьте в курсе всех событий: трансферы, матчи, интервью и анонсы.
          </p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {news.map((n, i) => {
            const imageUrl = getImageUrl(n.image);
            return (
            <motion.article
              key={n._id || n.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              onClick={() => navigate(`/news/${n._id || n.id}`)}
              className="group glass rounded-2xl p-6 hover:border-white/10 transition-all cursor-pointer"
            >
              {imageUrl && (
                <img src={imageUrl} alt={n.title} className="w-full h-48 object-cover rounded-xl mb-4 transition-transform duration-500 group-hover:scale-105" />
              )}
              <div className="flex items-start justify-between gap-4 mb-4">
                <span className="px-3 py-1 rounded-full bg-accent-500/20 text-accent-400 text-xs font-semibold">
                  {n.category}
                </span>
                <div className="flex items-center gap-2 text-white/40 text-sm shrink-0">
                  <Calendar className="w-4 h-4" />
                  {n.date}
                </div>
              </div>
              <h2 className="text-xl font-bold text-white mb-3 group-hover:text-accent-400 transition-colors">
                {n.title}
              </h2>
              <p className="text-white/50 leading-relaxed mb-4">{n.excerpt}</p>
              <div className="flex items-center gap-2 text-accent-400 text-sm font-medium group-hover:gap-3 transition-all">
                Читать далее <ArrowRight className="w-4 h-4" />
              </div>
            </motion.article>
          );
          })}
        </div>
      </div>
    </div>
  );
}
export default News;