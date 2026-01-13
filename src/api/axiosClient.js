import axios from 'axios';
import { CONFIG } from '../config';
import { useAuth } from "../context/AuthContext.jsx";

// 1. Create the instance
const apiClient = axios.create({
  baseURL: CONFIG.API_BASE_URL_RAW,
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
  localStorage.removeItem('role');
  sessionStorage.removeItem('sea-token');
  sessionStorage.removeItem('role');
};

// 2. Request Interceptor (Attach Token)
apiClient.interceptors.request.use(
  (config) => {
    const token = getAuthToken();

    if (token && !config.skipAuth) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 3. Response Interceptor (Global Error Handling)
apiClient.interceptors.response.use(
  (response) => response.data, // Return data directly, avoiding .data.data in components
  (error) => {
    // Handle 401 (Unauthorized) - Auto logout logic here
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      console.error('Unauthorized! Redirecting to login...');
      // window.location.href = '/login';
      if (!window.location.pathname.includes('/login')) {
        clearAuthData();
        // Force Redirect to Login
        // We use window.location.href instead of useNavigate because
        // we want to wipe the app state clean.
        window.location.href = '/login?session_expired=true';
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;