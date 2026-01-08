import apiClient from './axiosClient';

// Assuming your backend has a generic upload endpoint
// If it's specific to blogs, change to '/blogs/upload'
const ENDPOINT = '/sign'; 

export const uploadService = {
  uploadImage: async (file) => {
    const formData = new FormData();
    formData.append('file', file); // 'file' must match backend field name

    return await apiClient.post(ENDPOINT, formData, {
      headers: {
        'Content-Type': 'multipart/form-data', // Crucial for file uploads
      },
    });
  },
};