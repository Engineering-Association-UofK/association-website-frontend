import axios from 'axios';
import { CONFIG } from '../config';

// 1. Create the instance
const apiClient = axios.create({
  baseURL: CONFIG.API_BASE_URL,
  timeout: CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// 2. Request Interceptor (Attach Token)
apiClient.interceptors.request.use(
  (config) => {
    // const token = localStorage.getItem('authToken'); // Or retrieve from Context/Store
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
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
      console.error('Unauthorized! Redirecting to login...');
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;