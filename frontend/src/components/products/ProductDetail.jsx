import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { getProduct } from '../../services/productService';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { getImageUrl } from '../../utils/imageHelper';
import LoadingSpinner from '../common/LoadingSpinner';

function ProductDetail() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [adding, setAdding] = useState(false);
    const { addItem } = useCart();
    const { isAuth } = useAuth();

    useEffect(() => {
        fetchProduct();
    }, [id]);

    const fetchProduct = async () => {
        try {
            setLoading(true);
            const data = await getProduct(id);
            setProduct(data);
        } catch (err) {
            setError('Product not found');
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = async () => {
        if (!isAuth) {
            toast.error('Please login to add items to cart');
            return;
        }

        if (quantity > product.stock) {
            toast.error('Not enough stock available');
            return;
        }

        setAdding(true);
        const result = await addItem(product.id, quantity);
        if (result.success) {
            toast.success(`${product.name} added to cart!`);
        } else {
            toast.error(result.error || 'Failed to add to cart');
        }
        setAdding(false);
    };

    if (loading) {
        return <LoadingSpinner />;
    }

    if (error || !product) {
        return (
            <div className="container mx-auto px-4 py-16 text-center">
                <div className="text-xl text-red-600">{error || 'Product not found'}</div>
                <Link to="/products" className="text-blue-500 hover:underline mt-4 inline-block">
                    ← Back to Products
                </Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <Link to="/products" className="text-blue-500 hover:underline mb-4 inline-block">
                ← Back to Products
            </Link>
            
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-2">
                    <div className="h-96 bg-gray-200 flex items-center justify-center">
                        {product.image ? (
                            <img 
                                src={getImageUrl(product.image)} 
                                alt={product.name}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <span className="text-gray-400 text-6xl">📦</span>
                        )}
                    </div>
                    
                    <div className="p-6">
                        <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
                        <p className="text-gray-600 mb-2">{product.category_name}</p>
                        
                        <div className="mt-4">
                            <span className="text-3xl font-bold text-blue-600">
                                ${product.final_price}
                            </span>
                            {product.discount_price && (
                                <span className="text-lg text-gray-400 line-through ml-2">
                                    ${product.price}
                                </span>
                            )}
                        </div>
                        
                        <p className="text-sm text-gray-500 mt-2">
                            Stock: {product.stock} available
                        </p>
                        
                        <div className="mt-4">
                            <h3 className="font-semibold">Description</h3>
                            <p className="text-gray-600 mt-1">{product.description}</p>
                        </div>
                        
                        <div className="mt-6 flex items-center space-x-4">
                            <div className="flex items-center border rounded">
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="px-4 py-2 hover:bg-gray-100"
                                >
                                    -
                                </button>
                                <span className="px-6 py-2">{quantity}</span>
                                <button
                                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                                    className="px-4 py-2 hover:bg-gray-100"
                                    disabled={quantity >= product.stock}
                                >
                                    +
                                </button>
                            </div>
                            
                            <button
                                onClick={handleAddToCart}
                                disabled={adding || product.stock === 0}
                                className="flex-1 bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 disabled:opacity-50"
                            >
                                {adding ? 'Adding...' : 'Add to Cart'}
                            </button>
                        </div>
                        
                        {product.stock === 0 && (
                            <p className="text-red-500 mt-2 font-semibold">Out of stock</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductDetail;