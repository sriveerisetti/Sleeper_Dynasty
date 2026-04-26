import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL || '/api';

export const api = axios.create({
  baseURL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.response.use(
  (resp) => resp,
  (err) => {
    console.error('API error:', err?.response?.data || err.message);
    return Promise.reject(err);
  }
);
