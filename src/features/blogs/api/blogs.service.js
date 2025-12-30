import apiClient from '../../../api/axiosClient';

const ENDPOINT = '/blogs';

export const blogService = {
  getAll: async (params) => {
    // params can be { page: 1, limit: 10, category: 'tech' }
    return await apiClient.get(ENDPOINT, { params });
  },

  getById: async (id) => {
    return await apiClient.get(`${ENDPOINT}/${id}`);
  },

  create: async (data) => {
    return await apiClient.post(ENDPOINT, data);
  },

  update: async (id, data) => {
    console.log("update", data);
    return await apiClient.put(`${ENDPOINT}/${id}`, data);
  },

  delete: async (id) => {
    return await apiClient.delete(`${ENDPOINT}/${id}`);
  },
};