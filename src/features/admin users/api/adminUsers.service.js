import apiClient from '../../../api/axiosClient';

const ENDPOINT = '/v1/admin';

export const adminUsersService = {
  getAll: async () => {
    return await apiClient.get(`${ENDPOINT}`);
  },

  // getById: async (id) => {
  //   return await apiClient.get(`${ENDPOINT}/${id}`);
  // },

  // getByUsername: async (username) => {
  //   return await apiClient.get(`${ENDPOINT}/username/${username}`);
  // },

  makeManager: async ({id}) => {
    return await apiClient.post(`${ENDPOINT}/add-manager/${id}`);
  },

  promote: async (user_id) => {
    return await apiClient.post(`${ENDPOINT}/${user_id}`);
  },

  update: async (data) => {
    return await apiClient.put(`${ENDPOINT}`, data);
  },

  // updateEmail: async (data) => {
  //   return await apiClient.put(`${ENDPOINT}/update-email`, data);
  // },

  delete: async (id) => {
    return await apiClient.delete(`${ENDPOINT}/${id}`);
  },
};