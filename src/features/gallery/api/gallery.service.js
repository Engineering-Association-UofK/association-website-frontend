import apiClient from '../../../api/axiosClient';

const ENDPOINT = '/api/gallery';

export const galleryService = {
  getAll: async () => {
    return await apiClient.get(ENDPOINT, { skipAuth: true });
  },

  create: async (data) => {
    return await apiClient.post(ENDPOINT, data);
  },

  delete: async (id) => {
    return await apiClient.delete(`${ENDPOINT}/${id}`);
  },
};