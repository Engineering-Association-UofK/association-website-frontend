import apiClient from '../../../api/axiosClient';

const ENDPOINT = '/api/faqs';

export const faqService = {
  getAll: async (queryParams) => {
    return await apiClient.get(ENDPOINT, { params: queryParams, skipAuth: true });
  },

  getById: async (id, queryParams) => {
    return await apiClient.get(`${ENDPOINT}/${id}`, { params: queryParams });
  },

  create: async (data) => {
    return await apiClient.post(ENDPOINT, data);
  },

  update: async (data) => {
    console.log("update", data);
    return await apiClient.put(`${ENDPOINT}`, data);
  },

  delete: async (id) => {
    return await apiClient.delete(`${ENDPOINT}/${id}`);
  },
};