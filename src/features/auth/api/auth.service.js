import apiClient from '../../../api/axiosClient';

const ENDPOINT = '/admin';

export const authService = {
  login: async ({ name, password, isAdmin }) => {
    // credentials = { name, password }
    const endpoint = isAdmin ? '/admin/login' : '/login'
    const response = await apiClient.post(`${endpoint}`, { name, password });
    return response; // Expecting { token }
  },

  register: async (userData) => {
    // userData = { name, email, password }
    const response = await apiClient.post(`${ENDPOINT}/register`, userData);
    return response;
  },

  sendVerificationCode: async (name) => {
    return await apiClient.post('/admin/send-code', { name });
  },

  verifyAdmin: async ({ name, code }) => {
    return await apiClient.post('/admin/verify', { name, code });
  },

  logout: async () => {
    // Optional: Call backend to invalidate session if needed
    // await apiClient.post(`${ENDPOINT}/logout`);
  }
};