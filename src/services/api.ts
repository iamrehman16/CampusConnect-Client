import axios from 'axios';
import { getAccessToken, getRefreshToken, clearTokens } from '../features/auth/session/authSession';
import { clearUser } from '../features/users/session/userSession';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3100/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Useful if the auth sets cookies
});

// Add accessToken to requests if available
api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token && config.headers) {
    // Determine whether to send access or refresh token based on the endpoint
    if (config.url === '/auth/refresh') {
      const refreshToken = getRefreshToken();
      if (refreshToken) {
        config.headers.Authorization = `Bearer ${refreshToken}`;
      }
    } else {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Handle response errors globally
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry && originalRequest.url !== '/auth/login' && originalRequest.url !== '/auth/refresh') {
      originalRequest._retry = true;
      try {
        // Attempt to refresh
        const res = await api.post('/auth/refresh');
        const newAccessToken = res.data.accessToken;
        // Session storage is handled by authService
        localStorage.setItem('accessToken', newAccessToken);
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Token expired or invalid
        clearTokens();
        clearUser();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
