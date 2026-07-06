import api from './api';

export const getProducts = async (search = '') => {
    try {
        let url = '/products/';
        if (search) {
            url = `/products/?search=${search}`;
        }
        const response = await api.get(url);
        return response.data;
    } catch (error) {
        throw error.response?.data || { error: 'Failed to fetch products' };
    }
};

export const getProduct = async (id) => {
    try {
        const response = await api.get(`/products/${id}/`);
        return response.data;
    } catch (error) {
        throw error.response?.data || { error: 'Product not found' };
    }
};

export const getCategories = async () => {
    try {
        const response = await api.get('/products/categories/');
        return response.data;
    } catch (error) {
        throw error.response?.data || { error: 'Failed to fetch categories' };
    }
};