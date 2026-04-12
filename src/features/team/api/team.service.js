import newApiClient from '../../../api/newAxiosClient';

const ENDPOINT = '/api/v1/cms/team';

export const teamService = {
    getAll: () => newApiClient.get(ENDPOINT, { skipAuth: true }),
};