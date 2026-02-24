import apiClient from '../../../api/axiosClient';

const ENDPOINT = '/api/secretariats';
const DASHBOARD_ENDPOINT = '/api/secretariats/dashboard';

export const secretariatService = {
    // Public endpoints (no auth needed)
    getPublicAll: async () => {
        return await apiClient.get(ENDPOINT, { skipAuth: true });
    },

    getPublicById: async (id) => {
        return await apiClient.get(`${ENDPOINT}/${id}`, { skipAuth: true });
    },

    // Admin/Dashboard endpoints
    getAll: async () => {
        return await apiClient.get(DASHBOARD_ENDPOINT);
    },

    getById: async (id) => {
        return await apiClient.get(`${DASHBOARD_ENDPOINT}/${id}`);
    },

    create: async (data) => {
        return await apiClient.post(DASHBOARD_ENDPOINT, data);
    },

    update: async (data) => {
        return await apiClient.put(DASHBOARD_ENDPOINT, data);
    },

    delete: async (id) => {
        return await apiClient.delete(`${DASHBOARD_ENDPOINT}/${id}`);
    },
};
