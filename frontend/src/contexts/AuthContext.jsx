import React, { createContext, useState, useContext, useEffect } from 'react';
import { getProfile, isAuthenticated, logout as logoutService } from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuth, setIsAuth] = useState(false);

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        if (isAuthenticated()) {
            try {
                const userData = await getProfile();
                setUser(userData);
                setIsAuth(true);
            } catch (error) {
                logoutService();
                setUser(null);
                setIsAuth(false);
            }
        }
        setLoading(false);
    };

    const logout = () => {
        logoutService();
        setUser(null);
        setIsAuth(false);
    };

    const updateUser = (userData) => {
        setUser(userData);
        setIsAuth(true);
    };

    return (
        <AuthContext.Provider value={{
            user,
            isAuth,
            loading,
            logout,
            updateUser,
            checkAuth
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};