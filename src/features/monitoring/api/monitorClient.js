import axios from 'axios';
import { CONFIG } from '../../../config';

const monitorClient = axios.create({
    baseURL: CONFIG.API_MONITOR_URL,
    timeout: CONFIG.TIMEOUT,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
});

// Helper: Get Token from either storage
const getAuthToken = () => {
  return localStorage.getItem('sea-token') || sessionStorage.getItem('sea-token');
};

// Helper: Clear all auth data
const clearAuthData = () => {
  localStorage.removeItem('sea-token');
  localStorage.removeItem('sea-user');
  sessionStorage.removeItem('sea-token');
  sessionStorage.removeItem('sea-user');
};


monitorClient.interceptors.request.use(
    (config) => {
      const token = getAuthToken();
  
      if (token && !config.skipAuth) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
);
  
monitorClient.interceptors.response.use(
    (response) => response.data,
    (error) => {
        const response = error.response;
        const currentPath = window.location.pathname;
        
        if (response?.status === 401 || response?.data?.status === 401) {
            // Token expired or invalid
            localStorage.removeItem('token');
            console.error('Unauthorized! Redirecting to login...');
            if (!currentPath.includes('/login') && !currentPath.includes('/register')) {
                clearAuthData();
                window.location.href = '/login?session_expired=true';
            }
        }
        return Promise.reject(error);
    }
);

export default monitorClient;