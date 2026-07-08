import api from './api';

export const checkout = async (orderData) => {
    try {
        const response = await api.post('/orders/checkout/', orderData);
        return response.data;
    } catch (error) {
        throw error.response?.data || { error: 'Checkout failed' };
    }
};

export const getMyOrders = async () => {
    try {
        const response = await api.get('/orders/my-orders/');
        return response.data;
    } catch (error) {
        throw error.response?.data || { error: 'Failed to fetch orders' };
    }
};
