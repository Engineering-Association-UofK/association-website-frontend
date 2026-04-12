// src/config/api.js
export const API_BASE = import.meta.env.VITE_SEA_API_BASE_URL; // ✅ correct URL

export const endpoints = {
  forms:     `${API_BASE}/api/v1/form`,
  pages:     `${API_BASE}/api/v1/form/page`,
  questions: `${API_BASE}/api/v1/form/question`,
  submit:    `${API_BASE}/api/v1/form/submit`,
  analysis:  (id) => `${API_BASE}/api/v1/form/analysis/${id}`,
};

export const authFetch = (url, options = {}) => {
  const token = localStorage.getItem('sea-token') || sessionStorage.getItem('sea-token');

  return fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...options.headers,
    }
  });
};