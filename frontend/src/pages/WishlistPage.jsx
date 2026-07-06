import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../contexts/WishlistContext';
import { getProducts } from '../services/productService';
import ProductCard from '../components/products/ProductCard';
import LoadingSpinner from '../components/common/LoadingSpinner';

function WishlistPage() {
    const { wishlist } = useWishlist();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchWishlistProducts();
    }, [wishlist]);

    const fetchWishlistProducts = async () => {
        try {
            setLoading(true);
            const allProducts = await getProducts();
            const wishlistProducts = allProducts.filter(p => wishlist.includes(p.id));
            setProducts(wishlistProducts);
        } catch (error) {
            console.error('Failed to fetch wishlist products');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <LoadingSpinner />;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex items-center gap-3 mb-8">
                <h1 className="text-3xl font-bold">❤️ My Wishlist</h1>
                <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-semibold">
                    {products.length} items
                </span>
            </div>

            {products.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
                    <div className="text-6xl mb-4">💔</div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Your wishlist is empty</h3>
                    <p className="text-gray-500 mb-4">Start adding your favorite products!</p>
                    <Link to="/products" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
                        Browse Products
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            )}
        </div>
    );
}

export default WishlistPage;