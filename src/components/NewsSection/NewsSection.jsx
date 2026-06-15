import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Calendar } from "lucide-react";
import { api } from "../../services/api";
import { news as localNews } from "../../data/news";

const normalizeNews = (items) =>
  items.map((item) => ({
    ...item,
    _id: item._id || String(item.id),
  }));

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

function NewsSection() {
  const [news, setNews] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.getNews()
      .then((data) => {
        if (data?.length) setNews(data);
        else setNews(normalizeNews(localNews));
      })
      .catch(() => setNews(normalizeNews(localNews)));
  }, []);

  return (
    <section id="news" className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-12"
        >
          <div>
            <span className="text-accent-400 text-sm font-semibold uppercase tracking-wider">
              Новости
            </span>
            <h2 className="font-display text-4xl sm:text-5xl font-bold text-white mt-2">
              Последние <span className="text-gradient">события</span>
            </h2>
          </div>
          <a
            href="/news"
            className="group flex items-center gap-2 text-white/70 hover:text-white font-medium transition-colors"
          >
            Все новости
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {news.map((n) => (
            <motion.article
              key={n._id || n.id}
              variants={item}
              onClick={() => navigate(`/news/${n._id || n.id}`)}
              className="group relative glass rounded-2xl overflow-hidden hover:border-white/10 transition-all duration-300 cursor-pointer"
            >
              <div className="aspect-[16/10] bg-gradient-to-br from-brand-800 to-brand-900 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-brand-950/80 to-transparent" />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 rounded-full bg-accent-500/90 text-white text-xs font-semibold">
                    {n.category}
                  </span>
                </div>
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2 text-white/40 text-xs mb-3">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{n.date}</span>
                </div>
                <h3 className="text-white font-semibold text-lg mb-2 group-hover:text-accent-400 transition-colors line-clamp-2">
                  {n.title}
                </h3>
                <p className="text-white/50 text-sm leading-relaxed line-clamp-3">
                  {n.excerpt}
                </p>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export default NewsSection;
