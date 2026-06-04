import apiClient from '../../../api/axiosClient';

const VIEW_ENDPOINT = '/v1/event';
const USER_ENDPOINT = '/v1/account/event';
const ADMIN_ENDPOINT = '/v1/admin/event';

export const eventService = {
    // Open endpoints

    getEvents: (page, limit) => {
        return apiClient.get(`${VIEW_ENDPOINT}`, { params: { page, limit } })
    },

    getEvent: (id) => {
        return apiClient.get(`${VIEW_ENDPOINT}/${id}`)
    },

    // Application endpoints

    getStatus: (page, limit, eventID = 0) => {
        return apiClient.get(`${USER_ENDPOINT}/status`, { params: { page, limit, eventID } });
    },
    
    cancel: (id) => {
        return apiClient.post(`${USER_ENDPOINT}/cancel/${id}`);
    },

    apply: (id) => {
        return apiClient.post(`${USER_ENDPOINT}/apply/${id}`);
    },

    // Admin endpoints

    getEventParticipants: (id) => {
        return apiClient.get(`${ADMIN_ENDPOINT}/${id}/participants`)
    },
    
    create: (data) => {
        return apiClient.post(`${ADMIN_ENDPOINT}`, { data });
    },

    update: (data) => {
        return apiClient.post(`${ADMIN_ENDPOINT}`, { data });
    },

    delete: (id) => {
        return apiClient.delete(`${ADMIN_ENDPOINT}/${id}`);
    },

    generateCerts: (data) => {
        return apiClient.get(`${ADMIN_ENDPOINT}/generate-certs`, { data });
    },

    sendFinishEmails: (data) => {
        return apiClient.get(`${ADMIN_ENDPOINT}/send-finish-emails`, { data });
    },

    sendEmails: (data) => {
        return apiClient.get(`${ADMIN_ENDPOINT}/send-emails`, { data })
    }
};