import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { LogIn, UserPlus, Shield } from 'lucide-react';
import toast from 'react-hot-toast';
export default function Login() {
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isRegister) {
        await register(form.name, form.email, form.password);
        toast.success('Регистрация успешна!');
      } else {
        await login(form.email, form.password);
        toast.success('Добро пожаловать!');
      }
      navigate('/');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <Helmet>
        <title>{isRegister ? 'Регистрация' : 'Вход'} | Ледокол Гродно</title>
      </Helmet>
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-md glass rounded-2xl p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent-500 to-accent-600 flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">
              {isRegister ? 'Создать аккаунт' : 'Вход в аккаунт'}
            </h1>
            <p className="text-white/40 text-sm mt-2">
              {isRegister ? 'Присоединяйтесь к сообществу болельщиков' : 'Войдите для доступа к профилю'}
            </p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <input
                type="text"
                placeholder="Ваше имя"
                className="w-full p-3 rounded-xl bg-brand-950 border border-white/10 text-white placeholder-white/30 focus:border-accent-500 outline-none"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            )}
            <input
              type="email"
              placeholder="Email"
              className="w-full p-3 rounded-xl bg-brand-950 border border-white/10 text-white placeholder-white/30 focus:border-accent-500 outline-none"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
            <input
              type="password"
              placeholder="Пароль"
              className="w-full p-3 rounded-xl bg-brand-950 border border-white/10 text-white placeholder-white/30 focus:border-accent-500 outline-none"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full p-3 rounded-xl bg-gradient-to-r from-accent-500 to-accent-600 text-white font-semibold hover:shadow-lg hover:shadow-accent-500/25 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : isRegister ? (
                <><UserPlus className="w-4 h-4" /> Зарегистрироваться</>
              ) : (
                <><LogIn className="w-4 h-4" /> Войти</>
              )}
            </button>
          </form>
          <p className="mt-6 text-center text-sm text-white/40">
            {isRegister ? 'Уже есть аккаунт?' : 'Нет аккаунта?'}{' '}
            <button
              onClick={() => setIsRegister(!isRegister)}
              className="text-accent-400 hover:text-accent-300 font-medium"
            >
              {isRegister ? 'Войти' : 'Регистрация'}
            </button>
          </p>
        </div>
      </div>
    </>
  );
}
