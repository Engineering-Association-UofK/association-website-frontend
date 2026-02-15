export const CONFIG = {
    API_BASE_URL: (import.meta.env.VITE_API_BASE_URL_RAW || 'http://localhost:8080') + '/api',
    API_BASE_URL_RAW: import.meta.env.VITE_API_BASE_URL_RAW || 'http://localhost:8080',
    BOT_BASE_URL_RAW: import.meta.env.VITE_BOT_BASE_URL_RAW || 'http://localhost:8888',
  TIMEOUT: 10000,
};