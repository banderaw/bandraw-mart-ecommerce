import React, { createContext, useState, useContext, useEffect } from 'react';
import { getCart, addToCart, updateCartItem, removeFromCart, clearCart } from '../services/cartService';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(false);
    const [itemCount, setItemCount] = useState(0);
    const { isAuth } = useAuth();

    useEffect(() => {
        if (isAuth) {
            fetchCart();
        } else {
            setCart(null);
            setItemCount(0);
        }
    }, [isAuth]);

    const fetchCart = async () => {
        try {
            setLoading(true);
            const data = await getCart();
            setCart(data);
            setItemCount(data.total_items || 0);
        } catch (error) {
            console.error('Error fetching cart:', error);
        } finally {
            setLoading(false);
        }
    };

    const addItem = async (productId, quantity = 1) => {
        try {
            setLoading(true);
            await addToCart(productId, quantity);
            await fetchCart();
            return { success: true };
        } catch (error) {
            return { success: false, error: error.error || 'Failed to add to cart' };
        } finally {
            setLoading(false);
        }
    };

    const updateItem = async (cartItemId, quantity) => {
        try {
            setLoading(true);
            await updateCartItem(cartItemId, quantity);
            await fetchCart();
            return { success: true };
        } catch (error) {
            return { success: false, error: error.error || 'Failed to update cart' };
        } finally {
            setLoading(false);
        }
    };

    const removeItem = async (cartItemId) => {
        try {
            setLoading(true);
            await removeFromCart(cartItemId);
            await fetchCart();
            return { success: true };
        } catch (error) {
            return { success: false, error: error.error || 'Failed to remove item' };
        } finally {
            setLoading(false);
        }
    };

    const clearAll = async () => {
        try {
            setLoading(true);
            await clearCart();
            setCart(null);
            setItemCount(0);
            return { success: true };
        } catch (error) {
            return { success: false, error: error.error || 'Failed to clear cart' };
        } finally {
            setLoading(false);
        }
    };

    return (
        <CartContext.Provider value={{
            cart,
            loading,
            itemCount,
            fetchCart,
            addItem,
            updateItem,
            removeItem,
            clearAll
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within CartProvider');
    }
    return context;
};