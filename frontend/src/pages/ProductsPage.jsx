import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getProducts } from '../services/productService';
import ProductCard from '../components/products/ProductCard';
import LoadingSpinner from '../components/common/LoadingSpinner';

function ProductsPage() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const search = params.get('search') || '';
        const category = params.get('category') || '';
        fetchProducts(search, category);
    }, [location.search]);

    const fetchProducts = async (search, category) => {
        try {
            setLoading(true);
            const data = await getProducts(search);
            setProducts(data);
        } catch (err) {
            setError('Failed to load products');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <LoadingSpinner />;
    if (error) return <div className="text-center text-red-600 py-16">{error}</div>;

    const params = new URLSearchParams(location.search);
    const searchTerm = params.get('search') || '';

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800">
                    {searchTerm ? `Results for "${searchTerm}"` : 'All Products'}
                </h1>
                <div className="text-sm text-gray-500 mt-2 md:mt-0">
                    {products.length} products found
                </div>
            </div>

            {/* Products Grid - NO CATEGORIES SIDEBAR */}
            {products.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
                    <div className="text-6xl mb-4">🔍</div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">No products found</h3>
                    <p className="text-gray-500">Try adjusting your search or filter</p>
                    <button
                        onClick={() => navigate('/products')}
                        className="mt-4 text-blue-500 hover:underline"
                    >
                        Clear all filters
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            )}
        </div>
    );
}

export default ProductsPage;