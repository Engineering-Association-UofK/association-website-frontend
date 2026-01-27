import apiClient from '../../../api/axiosClient';

const ENDPOINT = '/admin';

export const adminUsersService = {
  getAll: async () => {
    return await apiClient.get(`${ENDPOINT}/get`);
  },

  getById: async (id) => {
    return await apiClient.get(`${ENDPOINT}/get/${id}`);
  },

  create: async (data) => {
    return await apiClient.post(`${ENDPOINT}/add`, data);
  },

  update: async (data) => {
    return await apiClient.put(`${ENDPOINT}/update`, data);
  },

  delete: async (id) => {
    return await apiClient.delete(`${ENDPOINT}/delete/${id}`);
  },
};