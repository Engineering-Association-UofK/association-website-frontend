import apiClient from '../../../api/axiosClient';

const ENDPOINT = '/api/secretariats';

export const secretariatService = {
    // Admin endpoints
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

    // Public endpoints
    getPublicAll: async () => {
        return await apiClient.get(`${ENDPOINT}`);
    },

    getPublicById: async (id) => {
        return await apiClient.get(`${ENDPOINT}/${id}`);
    },
};
