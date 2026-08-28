import apiClient from '../../../api/axiosClient';

const ENDPOINT = '/v1/auth';

export const authService = {
  login: async ({ username, password }) => {
    // credentials = { name, password }
    // const endpoint = isAdmin ? '/admin/login' : '/login'
    const response = await apiClient.post(`${ENDPOINT}/login`, { username, password }, { skipAuth: true });
    // console.log('login ', response);
    return response; // Expecting { token }
  },
  
  // Check current registration step
  checkRegistration: async (regCode) => {
    return await apiClient.post(`${ENDPOINT}/register/check`, {
      reg_code: regCode,
    });
  },

  // Submit any registration step (0, 1, 2, 3, or 5)
  doRegistrationStep: async (step, data) => {
    return await apiClient.post(`${ENDPOINT}/register/step`, {
      step: Number(step),
      data: data,
    });
  },

  // Send password reset email
  forgotPassword: async (payload) => {
    return await apiClient.post(`${ENDPOINT}/forgot-password`, payload);
  },

  logout: async () => {
    // Optional: Call backend to invalidate session if needed
    // await apiClient.post(`${ENDPOINT}/logout`);
  }
};