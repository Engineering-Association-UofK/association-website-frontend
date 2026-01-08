export const CONFIG = {
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
  API_BASE_URL_RAW: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
  ADMIN_BASE_URL: import.meta.env.VITE_ADMIN_BASE_URL || 'http://localhost:8080/admin',
  TIMEOUT: 10000,
};