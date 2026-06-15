import { useState } from "react";
import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, Instagram, Youtube, Send, Bell } from "lucide-react";
import { api } from "../../services/api";
import toast from "react-hot-toast";

function Footer() {
  const [email, setEmail] = useState("");

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    try {
      await api.subscribe(email);
      toast.success("Вы подписались на новости!");
      setEmail("");
    } catch (err) {
      toast.error(err.message || "Ошибка подписки");
    }
  };

  return (
    <footer className="relative bg-brand-950 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-500 to-accent-600 flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">ЛГ</span>
              </div>
              <span className="font-display text-xl font-bold tracking-wide text-white">
                ЛЕДОКОЛ ГРОДНО
              </span>
            </div>
            <p className="text-white/50 text-sm leading-relaxed mb-6">
              Любительский хоккейный клуб из Гродно. Мы ломаем лёд и идём
              к победам с 2015 года!
            </p>
            <div className="flex items-center gap-3">
              <a href="#" className="w-10 h-10 rounded-xl glass flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-xl glass flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all">
                <Youtube className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-xl glass flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all">
                <Send className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-display text-sm font-bold text-white uppercase tracking-wider mb-6">
              Навигация
            </h4>
            <nav className="flex flex-col gap-3">
              <Link to="/" className="text-white/50 hover:text-white text-sm transition-colors">Главная</Link>
              <Link to="/news" className="text-white/50 hover:text-white text-sm transition-colors">Новости</Link>
              <Link to="/team" className="text-white/50 hover:text-white text-sm transition-colors">Команда</Link>
              <Link to="/schedule" className="text-white/50 hover:text-white text-sm transition-colors">Расписание</Link>
              <Link to="/tournaments" className="text-white/50 hover:text-white text-sm transition-colors">Турниры</Link>
              <Link to="/about" className="text-white/50 hover:text-white text-sm transition-colors">О клубе</Link>
            </nav>
          </div>

          {/* Contacts */}
          <div>
            <h4 className="font-display text-sm font-bold text-white uppercase tracking-wider mb-6">
              Контакты
            </h4>
            <div className="flex flex-col gap-4">
              <div className="flex items-start gap-3 text-white/50 text-sm">
                <MapPin className="w-5 h-5 text-accent-400 shrink-0 mt-0.5" />
                <span>г. Гродно, Ледовый дворец, ул. Ожешко, 45</span>
              </div>
              <div className="flex items-center gap-3 text-white/50 text-sm">
                <Phone className="w-5 h-5 text-accent-400 shrink-0" />
                <span>+375 (15) 245-67-89</span>
              </div>
              <div className="flex items-center gap-3 text-white/50 text-sm">
                <Mail className="w-5 h-5 text-accent-400 shrink-0" />
                <span>info@ledokol-grodno.by</span>
              </div>
            </div>
          </div>

          {/* Subscribe */}
          <div>
            <h4 className="font-display text-sm font-bold text-white uppercase tracking-wider mb-6">
              Подписка
            </h4>
            <p className="text-white/50 text-sm mb-4">Получайте новости клуба на email</p>
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <input
                type="email"
                placeholder="Ваш email"
                required
                className="flex-1 p-3 rounded-xl bg-brand-950 border border-white/10 text-white placeholder-white/30 text-sm focus:border-accent-500 outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button type="submit" className="p-3 rounded-xl bg-accent-500 hover:bg-accent-600 text-white transition-colors">
                <Bell className="w-5 h-5" />
              </button>
            </form>

            <h4 className="font-display text-sm font-bold text-white uppercase tracking-wider mt-6 mb-4">
              Карта
            </h4>
            <div className="aspect-video rounded-xl glass overflow-hidden">
              <iframe
                title="Карта арены"
                src="https://www.openstreetmap.org/export/embed.html?bbox=23.79%2C53.67%2C23.85%2C53.70&layer=mapnik"
                className="w-full h-full border-0 opacity-60 hover:opacity-80 transition-opacity"
                loading="lazy"
              />
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/30 text-sm">© 2026 ХК «Ледокол Гродно». Все права защищены.</p>
          <p className="text-white/30 text-sm">Сделано в Беларуси 🇧🇾</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;