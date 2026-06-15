import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Menu, X, Ticket, LogIn, LogOut, Shield, User, Sun, Moon, Users } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import TicketModal from "../TicketModal/TicketModal";

const navLinks = [
  { to: "/", label: "Главная" },
  { to: "/news", label: "Новости" },
  { to: "/team", label: "Команда" },
  { to: "/schedule", label: "Расписание" },
  { to: "/tournaments", label: "Турниры" },
  { to: "/gallery", label: "Галерея" },
  { to: "/about", label: "Контакты" },
];

function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [ticketOpen, setTicketOpen] = useState(false);
  const { user, logout, isAdmin, isUserLevel1, isUserLevel2 } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "glass-strong shadow-lg shadow-black/20" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <NavLink to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-500 to-accent-600 flex items-center justify-center shadow-lg shadow-accent-500/20 group-hover:scale-105 transition-transform">
              <span className="text-white font-bold text-lg">ЛГ</span>
            </div>
            <span className="font-display text-xl font-bold tracking-wide text-white">
              ЛЕДОКОЛ ГРОДНО
            </span>
          </NavLink>

          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "text-white bg-white/10"
                      : "text-white/70 hover:text-white hover:bg-white/5"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/5 transition-all"
              title={theme === "dark" ? "Светлая тема" : "Тёмная тема"}
            >
              {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            {isAdmin && (
              <NavLink
                to="/admin"
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white/70 hover:text-white hover:bg-white/5 transition-all"
              >
                <Shield className="w-4 h-4" />
                Админ
              </NavLink>
            )}
            {isUserLevel1 && !isAdmin && (
              <span className="px-3 py-1 rounded-lg bg-accent-500/20 text-accent-400 text-xs font-medium">
                Пользователь 1 уровня
              </span>
            )}
            {isUserLevel2 && (
              <span className="px-3 py-1 rounded-lg bg-blue-500/20 text-blue-400 text-xs font-medium">
                Пользователь 2 уровня
              </span>
            )}
            {user ? (
              <NavLink
                to="/profile"
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white/70 hover:text-white hover:bg-white/5 transition-all"
              >
                <User className="w-4 h-4" />
                Профиль
              </NavLink>
            ) : (
              <NavLink
                to="/login"
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white/70 hover:text-white hover:bg-white/5 transition-all"
              >
                <LogIn className="w-4 h-4" />
                Войти
              </NavLink>
            )}
            <button
              onClick={() => setTicketOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-accent-500 to-accent-600 text-white text-sm font-semibold shadow-lg shadow-accent-500/25 hover:shadow-accent-500/40 hover:scale-105 transition-all duration-200"
            >
              <Ticket className="w-4 h-4" />
              Купить билет
            </button>
          </div>

          <button
            className="lg:hidden p-2 text-white/90 hover:text-white"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Меню"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden glass-strong border-t border-white/5 overflow-hidden"
          >
            <nav className="flex flex-col px-4 py-4 gap-1">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `px-4 py-3 rounded-lg text-base font-medium transition-all ${
                      isActive
                        ? "text-white bg-white/10"
                        : "text-white/70 hover:text-white hover:bg-white/5"
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
              <div className="mt-3 flex flex-col gap-2">
                {isAdmin && (
                  <NavLink
                    to="/admin"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white/10 text-white font-semibold"
                  >
                    <Shield className="w-4 h-4" />
                    Админ-панель
                  </NavLink>
                )}
                {isUserLevel1 && !isAdmin && (
                  <div className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-accent-500/20 text-accent-400 font-semibold">
                    <Users className="w-4 h-4" />
                    Пользователь 1 уровня
                  </div>
                )}
                {isUserLevel2 && (
                  <div className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-blue-500/20 text-blue-400 font-semibold">
                    <Users className="w-4 h-4" />
                    Пользователь 2 уровня
                  </div>
                )}
                {user ? (
                  <button
                    onClick={() => { logout(); navigate('/'); setMobileOpen(false); }}
                    className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white/10 text-white font-semibold"
                  >
                    <LogOut className="w-4 h-4" />
                    Выйти
                  </button>
                ) : (
                  <NavLink
                    to="/login"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white/10 text-white font-semibold"
                  >
                    <LogIn className="w-4 h-4" />
                    Войти
                  </NavLink>
                )}
                <button
                  onClick={() => { setTicketOpen(true); setMobileOpen(false); }}
                  className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-accent-500 to-accent-600 text-white font-semibold shadow-lg"
                >
                  <Ticket className="w-4 h-4" />
                  Купить билет
                </button>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
      <TicketModal isOpen={ticketOpen} onClose={() => setTicketOpen(false)} />
    </header>
  );
}

export default Header;