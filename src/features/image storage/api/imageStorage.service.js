import apiClient from '../../../api/axiosClient';

const ENDPOINT = '/v1/admin/gallery';

export const imageStorageService = {
  getAll: async () => {
    return await apiClient.get(ENDPOINT);
  },
 
  getById: async (id) => {
    return await apiClient.get(`${ENDPOINT}/${id}`);
  },

  // getByKeyword: async (keyword) => {
  //   return await apiClient.get(`${ENDPOINT}/open/${keyword}`, { skipAuth: true });
  // },

  create: async ({ file, file_name, alt_text = '' }) => {
    const formData = new FormData();
    formData.append('file', file); 
    formData.append('file_name', file_name); 
    formData.append('alt_text', alt_text);

    return await apiClient.post(ENDPOINT, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  // publish: async (data) => {
  //   return await apiClient.post(`${ENDPOINT}/news`, data);
  // },

  // update: async (data) => {
  //   return await apiClient.put(ENDPOINT, data);
  // },

  // delete: async (id) => {
  //   return await apiClient.delete(`${ENDPOINT}/${id}`);
  // },

  // unpublish: async (id) => {
  //   return await apiClient.delete(`${ENDPOINT}/news/${id}`);
  // },

  clear: async () => {
    return await apiClient.delete(`${ENDPOINT}`);
  },
};