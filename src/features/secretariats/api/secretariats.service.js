import apiClient from '../../../api/axiosClient';

const ENDPOINT = '/api/secretariats';

export const secretariatService = {
    getAll: async () => {
        return await apiClient.get(`${ENDPOINT}/dashboard`);
    },

    getById: async (id) => {
        return await apiClient.get(`${ENDPOINT}/dashboard/${id}`);
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
