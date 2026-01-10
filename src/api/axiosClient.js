import axios from 'axios';
import { CONFIG } from '../config';

// 1. Create the instance
const apiClient = axios.create({
  baseURL: CONFIG.API_BASE_URL_RAW,
  timeout: CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// 2. Request Interceptor (Attach Token)
apiClient.interceptors.request.use(
  (config) => {
    // const token = localStorage.getItem('authToken'); 
    const token = "eyJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoiUk9MRV9BRE1JTiIsInN1YiI6ImFkbWluIiwiaWF0IjoxNzY3OTgyMjg3LCJleHAiOjE3NjgxNTUwODd9.Rru_oD1Sql22jYvvoaOHSrNpsFlszbmDMixJZSzd06k"; 
    if (token) {
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
    }
    return Promise.reject(error);
  }
);

export default apiClient;