import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
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
import WishlistPage from './pages/WishlistPage'; // ✅ MAKE SURE THIS IS IMPORTED

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
                                <Route path="/cart" element={<CartPage />} />
                                <Route path="/checkout" element={<CheckoutPage />} />
                                <Route path="/orders" element={<OrderHistoryPage />} />
                                <Route path="/profile" element={<ProfilePage />} />
                                <Route path="/wishlist" element={<WishlistPage />} /> {/* ✅ THIS MUST BE HERE */}
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