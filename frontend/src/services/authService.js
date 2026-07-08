import api from './api';

export const register = async (userData) => {
    try {
        const response = await api.post('/auth/register/', userData);
        return response.data;
    } catch (error) {
        throw error.response?.data || { error: 'Registration failed' };
    }
};

export const login = async (credentials) => {
    try {
        const response = await api.post('/auth/login/', credentials);
        if (response.data.access) {
            localStorage.setItem('access_token', response.data.access);
            localStorage.setItem('refresh_token', response.data.refresh);
        }
        return response.data;
    } catch (error) {
        throw error.response?.data || { error: 'Login failed' };
    }
};

export const logout = async () => {
    const refresh = localStorage.getItem('refresh_token');

    try {
        if (refresh) {
            await api.post('/auth/logout/', { refresh });
        }
    } finally {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
    }
};

export const getProfile = async () => {
    try {
        const response = await api.get('/auth/profile/');
        return response.data;
    } catch (error) {
        throw error.response?.data || { error: 'Failed to get profile' };
    }
};

export const isAuthenticated = () => {
    return localStorage.getItem('access_token') !== null;
};
