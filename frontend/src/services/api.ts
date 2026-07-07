import axios from 'axios';

const API_URL = import.meta.env.PROD ? '/api' : 'http://localhost:5000/api';

export const api = axios.create({
  baseURL: API_URL,
});

export const getApiUrl = (path: string) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  // If API_URL is /api and path is /uploads, we might want http://localhost:5000/uploads if not prod
  const base = import.meta.env.PROD ? '' : 'http://localhost:5000';
  return `${base}${path.startsWith('/') ? '' : '/'}${path}`;
};

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
