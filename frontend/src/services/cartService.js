import api from './api';

export const getCart = async () => {
    try {
        const response = await api.get('/cart/');
        return response.data;
    } catch (error) {
        throw error.response?.data || { error: 'Failed to fetch cart' };
    }
};

export const addToCart = async (productId, quantity = 1) => {
    try {
        const response = await api.post('/cart/add/', { product_id: productId, quantity });
        return response.data;
    } catch (error) {
        throw error.response?.data || { error: 'Failed to add to cart' };
    }
};

export const updateCartItem = async (cartItemId, quantity) => {
    try {
        const response = await api.put('/cart/update/', { cart_item_id: cartItemId, quantity });
        return response.data;
    } catch (error) {
        throw error.response?.data || { error: 'Failed to update cart' };
    }
};

export const removeFromCart = async (cartItemId) => {
    try {
        const response = await api.delete('/cart/remove/', { data: { cart_item_id: cartItemId } });
        return response.data;
    } catch (error) {
        throw error.response?.data || { error: 'Failed to remove item' };
    }
};

export const clearCart = async () => {
    try {
        const response = await api.delete('/cart/clear/');
        return response.data;
    } catch (error) {
        throw error.response?.data || { error: 'Failed to clear cart' };
    }
};