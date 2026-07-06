import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import { useWishlist } from '../../contexts/WishlistContext';
import { getCategories } from '../../services/productService';
import SearchBar from './SearchBar';

function Navbar() {
    const { user, isAuth, logout } = useAuth();
    const { itemCount } = useCart();
    const { count: wishlistCount } = useWishlist();
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const fetchCategories = async () => {
        try {
            const data = await getCategories();
            setCategories(data);
        } catch (error) {
            console.error('Failed to fetch categories');
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleCategoryClick = (categoryId) => {
        navigate(`/products?category=${categoryId}`);
        setIsDropdownOpen(false);
    };

    return (
        <nav className="bg-white shadow-lg sticky top-0 z-50 border-b-4 border-blue-600">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                    {/* Logo - Bandraw Mart Brand */}
                    <Link to="/" className="flex items-center group">
                        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-2xl px-3 py-1 rounded-lg mr-2 group-hover:scale-105 transition">
                            BM
                        </div>
                        <div>
                            <span className="text-xl font-bold text-blue-600">Bandraw</span>
                            <span className="text-xl font-bold text-purple-600"> Mart</span>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-6">
                        {/* Categories Dropdown */}
                        <div className="relative" ref={dropdownRef}>
                            <button
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className="flex items-center text-gray-700 hover:text-blue-600 font-medium px-3 py-2 rounded-lg hover:bg-blue-50 transition"
                            >
                                📂 Categories
                                <svg 
                                    className={`ml-1 w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
                                    fill="none" 
                                    stroke="currentColor" 
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            {/* Dropdown Menu */}
                            {isDropdownOpen && (
                                <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-100 py-2 animate-fadeIn">
                                    <Link
                                        to="/products"
                                        onClick={() => setIsDropdownOpen(false)}
                                        className="block px-4 py-2.5 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors font-medium"
                                    >
                                        🛍️ All Products
                                    </Link>
                                    
                                    <div className="border-t border-gray-100 my-1"></div>
                                    
                                    {categories.map((category) => (
                                        <button
                                            key={category.id}
                                            onClick={() => handleCategoryClick(category.id)}
                                            className="block w-full text-left px-4 py-2.5 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors flex items-center justify-between"
                                        >
                                            <span className="flex items-center">
                                                <span className="mr-2">
                                                    {category.name === 'Electronics' && '📱'}
                                                    {category.name === 'Clothing' && '👕'}
                                                    {category.name === 'Books' && '📚'}
                                                    {!['Electronics', 'Clothing', 'Books'].includes(category.name) && '📦'}
                                                </span>
                                                {category.name}
                                            </span>
                                            <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">
                                                {category.product_count || 0}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        <Link to="/products" className="text-gray-700 hover:text-blue-600 font-medium transition">
                            All Products
                        </Link>
                    </div>

                    {/* Search Bar */}
                    <div className="hidden lg:block flex-1 max-w-md mx-4">
                        <SearchBar />
                    </div>

                    {/* Right Side */}
                    <div className="flex items-center space-x-4">
                        {/* Wishlist Icon */}
                        {isAuth && (
                            <Link to="/wishlist" className="text-gray-700 hover:text-red-500 relative transition">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                                {wishlistCount > 0 && (
                                    <span className="absolute -top-2 -right-4 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                        {wishlistCount}
                                    </span>
                                )}
                            </Link>
                        )}

                        {/* Cart Icon */}
                        <Link to="/cart" className="text-gray-700 hover:text-blue-600 relative transition">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            {isAuth && itemCount > 0 && (
                                <span className="absolute -top-2 -right-4 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-bounce">
                                    {itemCount}
                                </span>
                            )}
                        </Link>

                        {isAuth ? (
                            <div className="flex items-center space-x-3">
                                <Link to="/profile" className="text-gray-700 hover:text-blue-600 transition">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </Link>
                                <Link to="/orders" className="text-gray-700 hover:text-blue-600 transition">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                    </svg>
                                </Link>
                                <span className="text-sm font-medium text-gray-700 hidden sm:block">
                                    {user?.username}
                                </span>
                                <button
                                    onClick={handleLogout}
                                    className="text-red-500 hover:text-red-600 text-sm font-medium transition"
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-3">
                                <Link to="/login" className="text-gray-700 hover:text-blue-600 transition">
                                    Login
                                </Link>
                                <Link to="/register" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition">
                                    Register
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile Category Bar */}
            <div className="md:hidden bg-gradient-to-r from-blue-50 to-purple-50 border-t border-gray-200 px-4 py-2 flex items-center space-x-4 overflow-x-auto">
                <Link to="/products" className="text-sm text-gray-600 hover:text-blue-600 whitespace-nowrap font-medium">
                    🛍️ All
                </Link>
                {categories.slice(0, 5).map((category) => (
                    <button
                        key={category.id}
                        onClick={() => navigate(`/products?category=${category.id}`)}
                        className="text-sm text-gray-600 hover:text-blue-600 whitespace-nowrap"
                    >
                        {category.name}
                    </button>
                ))}
                {categories.length > 5 && (
                    <Link to="/products" className="text-sm text-blue-500 whitespace-nowrap font-medium">
                        +{categories.length - 5} more
                    </Link>
                )}
            </div>
        </nav>
    );
}

export default Navbar;