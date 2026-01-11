export const CONFIG = {
    API_BASE_URL: (import.meta.env.VITE_API_BASE_URL_RAW || 'http://localhost:8080') + '/api',
    API_BASE_URL_RAW: import.meta.env.VITE_API_BASE_URL_RAW || 'http://localhost:8080',
  TIMEOUT: 10000,
};