export const API_BASE_URL = import.meta.env.VITE_API_URL;

const getAuthHeaders = () => {
    const token = localStorage.getItem('authToken');
    return token ? { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' } : { 'Content-Type': 'application/json' };
};

export const login = async (name, password) => {
    try {
        const response = await fetch(`${API_BASE_URL}/admin/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, password })
        });
        if (!response.ok) throw new Error('Login failed');
        const data = await response.json();
        // Assuming the token is directly returned or in a specific field. 
        // Based on common patterns, it might be { token: "..." } or just the string if raw.
        // Let's assume standard JSON response { token: ... } or check response.
        return data;
    } catch (error) {
        throw error;
    }
};

export const fetchNews = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/blogs`);
        if (!response.ok) throw new Error('Failed to fetch news');
        return await response.json();
    } catch (error) {
        console.error("Error fetching news:", error);
        return [];
    }
};

export const addNews = async (newsItem) => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/blogs`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(newsItem)
        });
        if (!response.ok) throw new Error('Failed to add news');
        return await response.json();
    } catch (error) {
        throw error;
    }
};

export const deleteNews = async (id) => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/blogs/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });
        if (!response.ok) throw new Error('Failed to delete news');
        return true;
    } catch (error) {
        throw error;
    }
};

export const fetchGallery = async () => {
    try {
        // Assuming the endpoint is /api/gallery based on convention
        const response = await fetch(`${API_BASE_URL}/api/gallery`);
        if (!response.ok) throw new Error('Failed to fetch gallery images');
        return await response.json();
    } catch (error) {
        console.error("Error fetching gallery:", error);
        return [];
    }
};
