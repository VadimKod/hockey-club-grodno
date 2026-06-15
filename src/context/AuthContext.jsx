import { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      api.getMe()
        .then(setUser)
        .catch(() => localStorage.removeItem('token'))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const res = await api.login(email, password);
    localStorage.setItem('token', res.token);
    setUser(res.user);
    return res;
  };

  const register = async (name, email, password, role = 'fan') => {
    const res = await api.register(name, email, password, role);
    localStorage.setItem('token', res.token);
    setUser(res.user);
    return res;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const updateNotifications = async (notifications) => {
    const res = await api.updateNotifications(notifications);
    setUser({ ...user, notifications: res.notifications });
    return res;
  };

  // Проверки ролей
  const isGuest = !user;
  const isUserLevel1 = user?.role === 'user1'; // Пользователь первого уровня (игроки/тренеры)
  const isUserLevel2 = user?.role === 'user2'; // Пользователь второго уровня (фанаты)
  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      register, 
      logout, 
      updateNotifications,
      isGuest,
      isUserLevel1,
      isUserLevel2,
      isAdmin,
      loading 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
