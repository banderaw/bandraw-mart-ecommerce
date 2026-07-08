import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { WishlistProvider } from './contexts/WishlistContext';
import Navbar from './components/common/Navbar';

import HomePage from './pages/HomePage';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import ProductsPage from './pages/ProductsPage';
import ProductDetail from './components/products/ProductDetail';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderHistoryPage from './pages/OrderHistoryPage';
import ProfilePage from './pages/ProfilePage';
import WishlistPage from './pages/WishlistPage';

const ProtectedRoute = ({ children }) => {
    const { isAuth, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-gray-600">Checking session...</div>
            </div>
        );
    }

    if (!isAuth) {
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    return children;
};

function App() {
    return (
        <AuthProvider>
            <CartProvider>
                <WishlistProvider>
                    <Router>
                        <Navbar />
                        <div className="min-h-screen bg-gray-50">
                            <Routes>
                                <Route path="/" element={<HomePage />} />
                                <Route path="/login" element={<Login />} />
                                <Route path="/register" element={<Register />} />
                                <Route path="/products" element={<ProductsPage />} />
                                <Route path="/product/:id" element={<ProductDetail />} />
                                <Route path="/cart" element={<ProtectedRoute><CartPage /></ProtectedRoute>} />
                                <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
                                <Route path="/orders" element={<ProtectedRoute><OrderHistoryPage /></ProtectedRoute>} />
                                <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
                                <Route path="/wishlist" element={<ProtectedRoute><WishlistPage /></ProtectedRoute>} />
                            </Routes>
                        </div>
                        <Toaster position="top-right" />
                    </Router>
                </WishlistProvider>
            </CartProvider>
        </AuthProvider>
    );
}

export default App;
