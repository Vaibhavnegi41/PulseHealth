import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// This runs before every request your app sends
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("pulseToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});