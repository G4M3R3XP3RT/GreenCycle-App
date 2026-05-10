import axios from 'axios';

const API_URL = '/api';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (userData) => api.post('/auth/register', userData),
};

export const collectionService = {
  signalCollection: (data) => api.post('/collectes', data),
  getMyTours: () => api.get('/collectes/mes-tournees'),
  getMyCollections: () => api.get('/collectes/mes-collectes'),
  acceptCollection: (id) => api.put(`/collectes/${id}/accepter`),
  validateCollection: (id) => api.put(`/collectes/${id}/valider`),
};

export const userService = {
  getLeaderboard: () => api.get('/leaderboard'),
};

export const aiService = {
  chat: (message) => api.post('/chat', { message }),
};

export default api;
