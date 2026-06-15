import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Calendar, ArrowLeft, MessageCircle, Send, Trash2 } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { api } from "../../services/api";
import { news as localNews } from "../../data/news";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

export default function NewsDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [news, setNews] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getNewsItem(id)
      .then((item) => {
        setNews(item);
        api.getComments(id).then(setComments).catch(() => setComments([]));
      })
      .catch(() => {
        const item = localNews.find((n) => String(n.id) === id || String(n._id) === id);
        if (item) {
          setNews({ ...item, _id: item._id || String(item.id) });
          setComments([]);
        } else {
          navigate("/news");
        }
      })
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!user) return toast.error("Войдите, чтобы оставить комментарий");
    if (!commentText.trim()) return;
    try {
      await api.createComment({ newsId: id, text: commentText });
      setCommentText("");
      api.getComments(id).then(setComments);
      toast.success("Комментарий добавлен");
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!confirm("Удалить комментарий?")) return;
    try {
      await api.deleteComment(commentId);
      api.getComments(id).then(setComments);
      toast.success("Комментарий удалён");
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (loading) return <div className="text-center pt-32 text-white/50">Загрузка...</div>;
  if (!news) return null;

  return (
    <>
      <Helmet>
        <title>{news.title} | Ледокол Гродно</title>
        <meta name="description" content={news.excerpt} />
      </Helmet>
      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <button
            onClick={() => navigate("/news")}
            className="flex items-center gap-2 text-white/50 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Назад к новостям
          </button>

          <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="px-3 py-1 rounded-full bg-accent-500/20 text-accent-400 text-xs font-semibold">
              {news.category}
            </span>
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-white mt-4 mb-4">
              {news.title}
            </h1>
            <div className="flex items-center gap-2 text-white/40 text-sm mb-8">
              <Calendar className="w-4 h-4" />
              {news.date}
            </div>

            {news.image && (
              <img src={news.image} alt={news.title} className="w-full rounded-2xl mb-8 object-cover max-h-96" />
            )}

            <div className="prose prose-invert max-w-none text-white/70 leading-relaxed mb-12">
              <p className="text-lg">{news.excerpt}</p>
              {news.content && <p className="mt-4">{news.content}</p>}
            </div>
          </motion.article>

          {/* Comments */}
          <div className="border-t border-white/10 pt-8">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              Комментарии ({comments.length})
            </h3>

            <form onSubmit={handleAddComment} className="flex gap-3 mb-8">
              <input
                type="text"
                placeholder={user ? "Написать комментарий..." : "Войдите, чтобы комментировать"}
                disabled={!user}
                className="flex-1 p-3 rounded-xl bg-brand-950 border border-white/10 text-white placeholder-white/30 focus:border-accent-500 outline-none disabled:opacity-50"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
              />
              <button
                type="submit"
                disabled={!user || !commentText.trim()}
                className="px-4 py-3 rounded-xl bg-accent-500 hover:bg-accent-600 text-white disabled:opacity-50 disabled:hover:bg-accent-500 transition-colors"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>

            <div className="space-y-4">
              {comments.map((c) => (
                <div key={c._id} className="bg-brand-900/50 rounded-xl p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-accent-400 text-sm font-semibold">{c.userName}</span>
                      <p className="text-white/70 mt-1">{c.text}</p>
                    </div>
                    {(user?._id === c.userId?._id || user?.role === 'admin') && (
                      <button
                        onClick={() => handleDeleteComment(c._id)}
                        className="text-white/30 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
