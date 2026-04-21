import apiClient from '../../../api/axiosClient';

const ENDPOINT = '/v1/auth';

export const authService = {
  // login: async ({ username, password }) => {
  //   // credentials = { name, password }
  //   // const endpoint = isAdmin ? '/admin/login' : '/login'
  //   const response = await apiClient.post(`${ENDPOINT}/login`, { username, password }, { skipAuth: true });
  //   // console.log('login ', response);
  //   return response; // Expecting { token }
  // },
  login: async ({ username, password }) => {
    try {
      const response = await apiClient.post(
        `${ENDPOINT}/login`,
        { username, password },
        { skipAuth: true },
      );
      return response;
    } catch (error) {
      // طباعة تفاصيل الخطأ في حال فشل الاتصال بالسيرفر
      console.error("حدث خطأ أثناء تسجيل الدخول:", error.message);
      throw error;
    }
  },

  register: async (userData) => {
    // userData = { name, email, password }
    const response = await apiClient.post(`${ENDPOINT}/register`, userData, {
      skipAuth: true,
    });
    return response;
  },

  sendVerificationCode: async (user_id) => {
    return await apiClient.post(
      `${ENDPOINT}/send-verification-code`,
      { user_id },
      { skipAuth: true },
    );
  },

  verifyCode: async ({ user_id, code }) => {
    return await apiClient.post(
      `${ENDPOINT}/verify`,
      { user_id, code },
      { skipAuth: true },
    );
  },

  // verifyAdmin: async ({ name, code }) => {
  //   return await apiClient.post('/admin/verify', { name, code }, { skipAuth: true });
  // },

  // changePassword: async ({ oldPassword, newPassword, confirmPassword }) => {
  //   return await apiClient.put(`${ENDPOINT}/update-password`, { oldPassword, newPassword, confirmPassword });
  // },

  logout: async () => {
    // Optional: Call backend to invalidate session if needed
    // await apiClient.post(`${ENDPOINT}/logout`);
  },
};