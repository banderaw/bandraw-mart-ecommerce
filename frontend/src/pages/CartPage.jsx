import React from 'react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import CartItem from '../components/cart/CartItem';

function CartPage() {
    const { cart, loading } = useCart();
    const { isAuth } = useAuth();
    const navigate = useNavigate();

    if (!isAuth) {
        return (
            <div className="container mx-auto px-4 py-16 text-center">
                <h2 className="text-2xl font-bold mb-4">Please Login</h2>
                <p className="text-gray-600 mb-4">You need to login to view your cart.</p>
                <Link to="/login" className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600">
                    Login
                </Link>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-16 text-center">
                <div className="text-xl text-gray-600">Loading cart...</div>
            </div>
        );
    }

    if (!cart || cart.items?.length === 0) {
        return (
            <div className="container mx-auto px-4 py-16 text-center">
                <h2 className="text-2xl font-bold mb-4">Your Cart is Empty</h2>
                <p className="text-gray-600 mb-4">Start shopping to add items to your cart.</p>
                <Link to="/products" className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600">
                    Browse Products
                </Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    {cart.items.map((item) => (
                        <CartItem key={item.id} item={item} />
                    ))}
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow h-fit sticky top-4">
                    <h3 className="text-xl font-bold mb-4">Order Summary</h3>
                    
                    <div className="space-y-2 text-gray-600">
                        <div className="flex justify-between">
                            <span>Items ({cart.total_items})</span>
                            <span>${cart.total_price}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Shipping</span>
                            <span>$0.00</span>
                        </div>
                        <div className="flex justify-between border-t pt-2 mt-2 font-bold text-lg">
                            <span>Total</span>
                            <span className="text-blue-600">${cart.total_price}</span>
                        </div>
                    </div>
                    
                    <button
                        onClick={() => navigate('/checkout')}
                        className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 mt-4"
                    >
                        Proceed to Checkout
                    </button>
                </div>
            </div>
        </div>
    );
}

export default CartPage;