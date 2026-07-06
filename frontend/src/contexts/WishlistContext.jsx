import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
    const [wishlist, setWishlist] = useState([]);
    const { isAuth } = useAuth();

    useEffect(() => {
        if (isAuth) {
            loadWishlist();
        } else {
            setWishlist([]);
        }
    }, [isAuth]);

    const loadWishlist = () => {
        try {
            const saved = localStorage.getItem('wishlist');
            if (saved) {
                setWishlist(JSON.parse(saved));
            }
        } catch (error) {
            console.error('Failed to load wishlist');
        }
    };

    const saveWishlist = (items) => {
        localStorage.setItem('wishlist', JSON.stringify(items));
        setWishlist(items);
    };

    const addToWishlist = (productId) => {
        if (!wishlist.includes(productId)) {
            const newWishlist = [...wishlist, productId];
            saveWishlist(newWishlist);
            return true;
        }
        return false;
    };

    const removeFromWishlist = (productId) => {
        const newWishlist = wishlist.filter(id => id !== productId);
        saveWishlist(newWishlist);
        return true;
    };

    const isInWishlist = (productId) => {
        return wishlist.includes(productId);
    };

    const toggleWishlist = (productId) => {
        if (isInWishlist(productId)) {
            removeFromWishlist(productId);
            return false;
        } else {
            addToWishlist(productId);
            return true;
        }
    };

    return (
        <WishlistContext.Provider value={{
            wishlist,
            addToWishlist,
            removeFromWishlist,
            isInWishlist,
            toggleWishlist,
            count: wishlist.length
        }}>
            {children}
        </WishlistContext.Provider>
    );
};

export const useWishlist = () => {
    const context = useContext(WishlistContext);
    if (!context) {
        throw new Error('useWishlist must be used within WishlistProvider');
    }
    return context;
};