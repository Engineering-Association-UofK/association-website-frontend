import apiClient from '../../../api/axiosClient';

const ENDPOINT = '/v1/admin/certificate';

export const certificatesService = {
  getAll: async (page = 1, limit = 20) => {
    return await apiClient.get(ENDPOINT, {
      params: { page, limit },
    })
  },

  getById: async (id) => {
    return await apiClient.get(`${ENDPOINT}/${id}`)
  },
 
  create: async (data) => {
    const formData = new FormData();
    formData.append('event_id', data.event_id); 
    formData.append('recipient_email', data.recipient_email); 
    formData.append('recipient_name', data.recipient_name); 
    formData.append('recipient_user_id', data.recipient_user_id); 
    formData.append('signer_name_one', data.signer_name_one); 
    formData.append('signer_name_two', data.signer_name_two); 
    formData.append('signer_role_one', data.signer_role_one); 
    formData.append('signer_role_two', data.signer_role_two); 
    formData.append('signer_signature_one', data.signer_signature_one); 
    formData.append('signer_signature_two', data.signer_signature_two); 
    formData.append('template_id', data.template_id); 
    // return await apiClient.post(ENDPOINT, data)
    return await apiClient.post(ENDPOINT, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
 
  test: async (data) => {
    const formData = new FormData();
    formData.append('event_id', data.event_id); 
    formData.append('recipient_email', data.recipient_email); 
    formData.append('recipient_name', data.recipient_name); 
    formData.append('recipient_user_id', data.recipient_user_id); 
    formData.append('signer_name_one', data.signer_name_one); 
    formData.append('signer_name_two', data.signer_name_two); 
    formData.append('signer_role_one', data.signer_role_one); 
    formData.append('signer_role_two', data.signer_role_two); 
    formData.append('signer_signature_one', data.signer_signature_one); 
    formData.append('signer_signature_two', data.signer_signature_two); 
    formData.append('template_id', data.template_id); 
    // return await apiClient.post(ENDPOINT, data)
    return await apiClient.post(`${ENDPOINT}/test`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
 
  update: async (data) => {
    return await apiClient.put(ENDPOINT, data)
  },
 
  delete: async(id) => {
    return await apiClient.delete(`${ENDPOINT}/${id}`)
  },

  download: async (id) => {
    return await apiClient.get(`${ENDPOINT}/${id}`, {
      responseType: 'blob',
    });
  }
};