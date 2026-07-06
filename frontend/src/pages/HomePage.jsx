import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProducts, getCategories } from '../services/productService';
import ProductCard from '../components/products/ProductCard';
import LoadingSpinner from '../components/common/LoadingSpinner';

function HomePage() {
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const products = await getProducts();
            const cats = await getCategories();
            setFeaturedProducts(products.slice(0, 8));
            setCategories(cats);
        } catch (error) {
            console.error('Failed to fetch data');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <LoadingSpinner />;

    return (
        <div className="bg-gray-50">
            {/* HERO SECTION - Compact */}
            <section className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 text-white">
                <div className="container mx-auto px-4 py-16 md:py-20">
                    <div className="flex flex-col md:flex-row items-center justify-between">
                        <div className="max-w-xl">
                            <div className="inline-block bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold mb-3">
                                🎉 Welcome to Bandraw Mart
                            </div>
                            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                                Shop Smarter, 
                                <span className="text-yellow-300 block">Live Better</span>
                            </h1>
                            <p className="text-lg md:text-xl text-blue-100 mt-3">
                                Amazing products at unbeatable prices
                            </p>
                            <div className="flex flex-wrap gap-3 mt-5">
                                <Link 
                                    to="/products" 
                                    className="bg-white text-blue-600 px-6 py-2.5 rounded-lg font-semibold hover:bg-gray-100 transition shadow-lg"
                                >
                                    🛍️ Shop Now
                                </Link>
                                <Link 
                                    to="/products" 
                                    className="border-2 border-white text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition"
                                >
                                    Browse
                                </Link>
                            </div>
                        </div>
                        <div className="hidden lg:block text-8xl animate-float">
                            🛒
                        </div>
                    </div>
                </div>
            </section>

            {/* STATS - Compact */}
            <div className="bg-white border-b border-gray-200">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-6 text-center">
                        <div>
                            <div className="text-2xl font-bold text-blue-600">10K+</div>
                            <div className="text-sm text-gray-500">Customers</div>
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-purple-600">500+</div>
                            <div className="text-sm text-gray-500">Products</div>
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-pink-600">100%</div>
                            <div className="text-sm text-gray-500">Secure</div>
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-green-600">24/7</div>
                            <div className="text-sm text-gray-500">Support</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* CATEGORIES - Compact Grid */}
            <section className="py-8">
                <div className="container mx-auto px-4">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold">
                            Shop by <span className="text-blue-600">Category</span>
                        </h2>
                        <Link to="/products" className="text-blue-600 text-sm font-medium hover:underline">
                            View All →
                        </Link>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                        {categories.slice(0, 6).map((category) => (
                            <Link
                                key={category.id}
                                to={`/products?category=${category.id}`}
                                className="bg-white rounded-xl shadow-sm hover:shadow-md transition p-4 text-center hover:-translate-y-1 border border-gray-100"
                            >
                                <div className="text-3xl mb-1">
                                    {category.name === 'Electronics' && '📱'}
                                    {category.name === 'Clothing' && '👕'}
                                    {category.name === 'Books' && '📚'}
                                    {!['Electronics', 'Clothing', 'Books'].includes(category.name) && '📦'}
                                </div>
                                <h3 className="font-medium text-sm text-gray-800">{category.name}</h3>
                                <p className="text-xs text-gray-400">{category.product_count || 0}</p>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* FEATURED PRODUCTS */}
            <section className="py-8 bg-white">
                <div className="container mx-auto px-4">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold">
                            🔥 <span className="text-blue-600">Featured</span> Products
                        </h2>
                        <Link to="/products" className="text-blue-600 text-sm font-medium hover:underline">
                            View All →
                        </Link>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {featuredProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                </div>
            </section>

            {/* PROMO BANNER - Compact */}
            <section className="py-8">
                <div className="container mx-auto px-4">
                    <div className="bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-2xl px-6 py-8 text-center">
                        <h2 className="text-2xl md:text-3xl font-bold">
                            🎉 15% Off Everything!
                        </h2>
                        <p className="text-lg mt-1">
                            Use code: <span className="bg-white text-green-600 px-4 py-1 rounded-lg font-bold">WELCOME15</span>
                        </p>
                        <Link 
                            to="/products" 
                            className="inline-block mt-3 bg-white text-green-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition shadow-md"
                        >
                            Shop Now
                        </Link>
                    </div>
                </div>
            </section>

            {/* WHY CHOOSE US - Compact */}
            <section className="py-8 bg-gray-50">
                <div className="container mx-auto px-4">
                    <h2 className="text-2xl font-bold text-center mb-5">
                        Why <span className="text-blue-600">Bandraw Mart</span>
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-white p-5 rounded-xl shadow-sm text-center border border-gray-100">
                            <div className="text-4xl mb-2">🚚</div>
                            <h3 className="font-bold text-sm">Free Shipping</h3>
                            <p className="text-xs text-gray-500">Orders over $50</p>
                        </div>
                        <div className="bg-white p-5 rounded-xl shadow-sm text-center border border-gray-100">
                            <div className="text-4xl mb-2">🔒</div>
                            <h3 className="font-bold text-sm">Secure Payment</h3>
                            <p className="text-xs text-gray-500">100% secure</p>
                        </div>
                        <div className="bg-white p-5 rounded-xl shadow-sm text-center border border-gray-100">
                            <div className="text-4xl mb-2">📞</div>
                            <h3 className="font-bold text-sm">24/7 Support</h3>
                            <p className="text-xs text-gray-500">Always here</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* NEWSLETTER - Compact */}
            <section className="py-8 bg-white">
                <div className="container mx-auto px-4 max-w-2xl">
                    <div className="text-center">
                        <h3 className="text-xl font-bold mb-2">📧 Subscribe</h3>
                        <p className="text-sm text-gray-500 mb-3">Get updates on new products</p>
                        <form className="flex gap-2 max-w-md mx-auto">
                            <input
                                type="email"
                                placeholder="Enter email"
                                className="flex-1 px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <button className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition">
                                Subscribe
                            </button>
                        </form>
                    </div>
                </div>
            </section>

            {/* FOOTER - Compact */}
            <footer className="bg-gray-900 text-gray-300 py-8">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <div>
                            <div className="flex items-center mb-2">
                                <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-sm px-2 py-0.5 rounded mr-1">
                                    BM
                                </div>
                                <span className="font-bold text-white text-sm">Bandraw Mart</span>
                            </div>
                            <p className="text-xs text-gray-500">Your one-stop shop</p>
                        </div>
                        <div>
                            <h4 className="font-semibold text-white text-sm mb-2">Quick Links</h4>
                            <ul className="text-xs space-y-1">
                                <li><Link to="/products" className="hover:text-white">Products</Link></li>
                                <li><Link to="/cart" className="hover:text-white">Cart</Link></li>
                                <li><Link to="/orders" className="hover:text-white">Orders</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold text-white text-sm mb-2">Support</h4>
                            <ul className="text-xs space-y-1">
                                <li><a href="#" className="hover:text-white">FAQ</a></li>
                                <li><a href="#" className="hover:text-white">Shipping</a></li>
                                <li><a href="#" className="hover:text-white">Returns</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold text-white text-sm mb-2">Connect</h4>
                            <div className="flex space-x-3 text-lg">
                                <a href="#" className="hover:text-blue-400">📘</a>
                                <a href="#" className="hover:text-blue-400">🐦</a>
                                <a href="#" className="hover:text-blue-400">📸</a>
                            </div>
                        </div>
                    </div>
                    <div className="border-t border-gray-800 mt-4 pt-4 text-center text-xs text-gray-600">
                        © 2026 Bandraw Mart
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default HomePage;