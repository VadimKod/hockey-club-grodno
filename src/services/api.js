const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const REQUEST_TIMEOUT_MS = 5000;

const fetchWithTimeout = (url, options = {}) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  return fetch(url, { ...options, signal: controller.signal }).finally(() => {
    clearTimeout(timeoutId);
  });
};

const handleResponse = async (res) => {
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: 'Ошибка сервера' }));
    throw new Error(err.message);
  }
  return res.json();
};

const getToken = () => localStorage.getItem('token');

const headers = (auth = false) => {
  const h = { 'Content-Type': 'application/json' };
  if (auth) {
    const token = getToken();
    if (token) h['Authorization'] = `Bearer ${token}`;
  }
  return h;
};

export const api = {
  // Auth
  login: (email, password) =>
    fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify({ email, password })
    }).then(handleResponse),

  register: (name, email, password, role) =>
    fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify({ name, email, password, role })
    }).then(handleResponse),

  getMe: () =>
    fetch(`${API_URL}/auth/me`, {
      headers: headers(true)
    }).then(handleResponse),

  updateNotifications: (notifications) =>
    fetch(`${API_URL}/auth/notifications`, {
      method: 'PUT',
      headers: headers(true),
      body: JSON.stringify(notifications)
    }).then(handleResponse),

  updateProfile: (data) =>
    fetch(`${API_URL}/auth/profile`, {
      method: 'PUT',
      headers: headers(true),
      body: JSON.stringify(data)
    }).then(handleResponse),

  // Matches
  getMatches: () => fetchWithTimeout(`${API_URL}/matches`).then(handleResponse),
  getNextMatch: () => fetchWithTimeout(`${API_URL}/matches/next`).then(handleResponse),
  createMatch: (data) =>
    fetch(`${API_URL}/matches`, { method: 'POST', headers: headers(true), body: JSON.stringify(data) }).then(handleResponse),
  updateMatch: (id, data) =>
    fetch(`${API_URL}/matches/${id}`, { method: 'PUT', headers: headers(true), body: JSON.stringify(data) }).then(handleResponse),
  deleteMatch: (id) =>
    fetch(`${API_URL}/matches/${id}`, { method: 'DELETE', headers: headers(true) }).then(handleResponse),

  // News
  getNews: () => fetchWithTimeout(`${API_URL}/news`).then(handleResponse),
  getNewsItem: (id) => fetchWithTimeout(`${API_URL}/news/${id}`).then(handleResponse),
  createNews: (data) =>
    fetch(`${API_URL}/news`, { method: 'POST', headers: headers(true), body: JSON.stringify(data) }).then(handleResponse),
  updateNews: (id, data) =>
    fetch(`${API_URL}/news/${id}`, { method: 'PUT', headers: headers(true), body: JSON.stringify(data) }).then(handleResponse),
  deleteNews: (id) =>
    fetch(`${API_URL}/news/${id}`, { method: 'DELETE', headers: headers(true) }).then(handleResponse),

  // Players
  getPlayers: () => fetchWithTimeout(`${API_URL}/players`).then(handleResponse),
  getPlayer: (id) => fetchWithTimeout(`${API_URL}/players/${id}`).then(handleResponse),
  createPlayer: (data) =>
    fetch(`${API_URL}/players`, { method: 'POST', headers: headers(true), body: JSON.stringify(data) }).then(handleResponse),
  updatePlayer: (id, data) =>
    fetch(`${API_URL}/players/${id}`, { method: 'PUT', headers: headers(true), body: JSON.stringify(data) }).then(handleResponse),
  deletePlayer: (id) =>
    fetch(`${API_URL}/players/${id}`, { method: 'DELETE', headers: headers(true) }).then(handleResponse),

  // Standings
  getStandings: () => fetchWithTimeout(`${API_URL}/standings`).then(handleResponse),
  createStanding: (data) =>
    fetch(`${API_URL}/standings`, { method: 'POST', headers: headers(true), body: JSON.stringify(data) }).then(handleResponse),
  updateStanding: (id, data) =>
    fetch(`${API_URL}/standings/${id}`, { method: 'PUT', headers: headers(true), body: JSON.stringify(data) }).then(handleResponse),
  deleteStanding: (id) =>
    fetch(`${API_URL}/standings/${id}`, { method: 'DELETE', headers: headers(true) }).then(handleResponse),

  // Gallery
  getGallery: () => fetch(`${API_URL}/gallery`).then(handleResponse),
  createGallery: (data) =>
    fetch(`${API_URL}/gallery`, { method: 'POST', headers: headers(true), body: JSON.stringify(data) }).then(handleResponse),
  deleteGallery: (id) =>
    fetch(`${API_URL}/gallery/${id}`, { method: 'DELETE', headers: headers(true) }).then(handleResponse),

  // Upload
  uploadImage: (file) => {
    const formData = new FormData();
    formData.append('image', file);
    return fetch(`${API_URL}/upload`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${getToken()}` },
      body: formData
    }).then(handleResponse);
  },

  // Subscribers
  subscribe: (email) =>
    fetch(`${API_URL}/subscribers`, { method: 'POST', headers: headers(), body: JSON.stringify({ email }) }).then(handleResponse),

  // Comments
  getComments: (newsId) => fetch(`${API_URL}/comments/news/${newsId}`).then(handleResponse),
  createComment: (data) =>
    fetch(`${API_URL}/comments`, { method: 'POST', headers: headers(true), body: JSON.stringify(data) }).then(handleResponse),
  deleteComment: (id) =>
    fetch(`${API_URL}/comments/${id}`, { method: 'DELETE', headers: headers(true) }).then(handleResponse),

  // Votes
  getVotes: (matchId) => fetch(`${API_URL}/votes/match/${matchId}`).then(handleResponse),
  vote: (data) =>
    fetch(`${API_URL}/votes`, { method: 'POST', headers: headers(true), body: JSON.stringify(data) }).then(handleResponse),

  // Tickets
  createTicket: (data) =>
    fetch(`${API_URL}/tickets`, { method: 'POST', headers: headers(), body: JSON.stringify(data) }).then(handleResponse),
  getMyTickets: () =>
    fetch(`${API_URL}/tickets/my`, { headers: headers(true) }).then(handleResponse),

  // Tournaments
  getTournaments: () => fetch(`${API_URL}/tournaments`).then(handleResponse),
  getCurrentTournament: () => fetch(`${API_URL}/tournaments/current`).then(handleResponse),
};
