import apiClient from '../../../api/axiosClient';

const ENDPOINT = '/api/generics';

export const genericsService = {
  fetchByKeywords: async ({ keywords, lang }) => {
    return await apiClient.post(`${ENDPOINT}/get-batch`, { keywords, lang });
  },

  update: async (data) => {
    return await apiClient.put(`${ENDPOINT}/update`, data);
  },
};