import apiClient from '../../../api/axiosClient';

const ENDPOINT = '/api/bot/manage';

export const botCommandService = {
  getAll: async () => {
    return await apiClient.get(ENDPOINT);
  },

  getById: async (id) => {
    return await apiClient.get(`${ENDPOINT}/${id}`);
  },

  create: async (data) => {
    return await apiClient.post(ENDPOINT, data);
  },

  update: async (data) => {
    return await apiClient.put(`${ENDPOINT}`, data);
  },

  delete: async (id) => {
    return await apiClient.delete(`${ENDPOINT}/${id}`);
  },
};