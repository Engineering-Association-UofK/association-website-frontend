import apiClient from '../../../api/axiosClient';

const ENDPOINT = '/api/v1/cms/team';

export const teamService = {
    getAll: () => apiClient.get(ENDPOINT, { skipAuth: true }),
};