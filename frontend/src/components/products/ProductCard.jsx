import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { useWishlist } from '../../contexts/WishlistContext';
import { getImageUrl } from '../../utils/imageHelper';

function ProductCard({ product }) {
    const [quantity, setQuantity] = useState(1);
    const [adding, setAdding] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const { addItem } = useCart();
    const { isAuth } = useAuth();
    const { isInWishlist, toggleWishlist } = useWishlist();
    
    const isWishlisted = isInWishlist(product.id);

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

    const handleWishlist = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!isAuth) {
            toast.error('Please login to add to wishlist');
            return;
        }
        toggleWishlist(product.id);
        toast.success(isWishlisted ? 'Removed from wishlist 💔' : 'Added to wishlist ❤️');
    };

    // Calculate discount percentage
    const discountPercent = product.discount_price 
        ? Math.round(((product.price - product.discount_price) / product.price) * 100)
        : 0;

    return (
        <div 
            className="group relative bg-white rounded-xl shadow-sm hover:shadow-2xl transition-all duration-300 border border-gray-100 overflow-hidden transform hover:-translate-y-2"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Discount Badge - HIGHEST Z-INDEX */}
            {discountPercent > 0 && (
                <div className="absolute top-2 left-2 z-30 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-lg animate-pulse">
                    -{discountPercent}%
                </div>
            )}

            {/* Wishlist Button - HIGHEST Z-INDEX */}
            <button
                onClick={handleWishlist}
                className="absolute top-2 right-2 z-30 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center transition-all duration-300 hover:scale-110"
            >
                <span className={isWishlisted ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}>
                    {isWishlisted ? '❤️' : '🤍'}
                </span>
            </button>

            {/* Quick View Overlay - LOWER Z-INDEX when not hovered */}
            <div 
                className={`absolute inset-0 bg-black/40 z-20 flex items-center justify-center transition-opacity duration-300 pointer-events-none ${
                    isHovered ? 'opacity-100' : 'opacity-0'
                }`}
            >
                <Link 
                    to={`/product/${product.id}`}
                    className="bg-white text-gray-800 px-4 py-2 rounded-lg font-medium text-sm hover:bg-gray-100 transition transform -translate-y-2 group-hover:translate-y-0 pointer-events-auto"
                    onClick={(e) => e.stopPropagation()}
                >
                    👁️ Quick View
                </Link>
            </div>

            {/* Product Image */}
            <Link to={`/product/${product.id}`} className="block">
                <div className="h-48 bg-gray-200 flex items-center justify-center overflow-hidden relative">
                    {product.image ? (
                        <img 
                            src={getImageUrl(product.image)} 
                            alt={product.name}
                            className={`w-full h-full object-cover transition-transform duration-700 ${
                                isHovered ? 'scale-110' : 'scale-100'
                            }`}
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.style.display = 'none';
                                e.target.parentElement.innerHTML = '<span class="text-gray-400 text-4xl">📦</span>';
                            }}
                        />
                    ) : (
                        <span className="text-gray-400 text-4xl">📦</span>
                    )}
                    
                    {/* Stock Status */}
                    {product.stock === 0 && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-10">
                            <span className="bg-red-500 text-white px-4 py-2 rounded-lg font-bold text-sm">
                                Out of Stock
                            </span>
                        </div>
                    )}
                </div>
            </Link>
            
            {/* Product Info - CLICKABLE */}
            <div className="p-4 relative z-10">
                <Link to={`/product/${product.id}`}>
                    <h3 className="font-semibold text-gray-800 hover:text-blue-600 transition truncate">
                        {product.name}
                    </h3>
                </Link>
                
                <p className="text-xs text-gray-400 mt-0.5">{product.category_name}</p>
                
                {/* Rating Stars */}
                <div className="flex items-center mt-1">
                    <div className="flex text-yellow-400 text-xs">
                        {'★'.repeat(4)}{'☆'.repeat(1)}
                    </div>
                    <span className="text-xs text-gray-400 ml-1">(24)</span>
                </div>
                
                <div className="mt-2 flex items-center">
                    <span className="text-xl font-bold text-blue-600">
                        ${product.final_price}
                    </span>
                    {product.discount_price && (
                        <>
                            <span className="text-xs text-gray-400 line-through ml-2">
                                ${product.price}
                            </span>
                            <span className="text-xs text-green-500 ml-2 font-medium">
                                Save ${(product.price - product.discount_price).toFixed(2)}
                            </span>
                        </>
                    )}
                </div>
                
                <p className="text-xs text-gray-400 mt-0.5">
                    {product.stock > 0 ? `📦 ${product.stock} in stock` : '❌ Out of stock'}
                </p>

                {/* Add to Cart - CLICKABLE */}
                <div className="mt-3 flex items-center gap-2">
                    <input
                        type="number"
                        min="1"
                        max={product.stock}
                        value={quantity}
                        onChange={(e) => setQuantity(Number(e.target.value))}
                        onClick={(e) => e.stopPropagation()}
                        className="w-14 px-2 py-1.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        onClick={handleAddToCart}
                        disabled={adding || product.stock === 0}
                        className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${
                            product.stock === 0
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg hover:scale-105'
                        }`}
                    >
                        {adding ? (
                            <span className="flex items-center justify-center">
                                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            </span>
                        ) : (
                            product.stock === 0 ? 'Out of Stock' : 'Add to Cart'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ProductCard;