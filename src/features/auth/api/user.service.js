import apiClient from '../../../api/axiosClient';

const USERS_ENDPOINT = '/v1/users';
const AUTH_ENDPOINT = '/v1/auth';

export const userService = {
  getUserProfile: async (userId) => {
    const response = await apiClient.get(`${USERS_ENDPOINT}/${userId}`);
    return response;
  },

  updateUserAvatar: async (userId, formData) => {
    const response = await apiClient.put(`${USERS_ENDPOINT}/${userId}/avatar`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response;
  },

  updateUserName: async (userId, { name_en, name_ar }) => {
    const response = await apiClient.put(`${USERS_ENDPOINT}/${userId}`, { name_en, name_ar });
    return response;
  },

  changePassword: async ({ oldPassword, newPassword, confirmPassword }) => {
    const response = await apiClient.put(`${AUTH_ENDPOINT}/update-password`, {
      oldPassword,
      newPassword,
      confirmPassword,
    });
    return response;
  },

  deleteAccount: async (userId) => {
    const response = await apiClient.delete(`${USERS_ENDPOINT}/${userId}`);
    return response;
  },
};
