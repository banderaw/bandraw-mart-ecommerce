import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-hot-toast';
import { checkout } from '../services/orderService';

function CheckoutPage() {
    const { cart, clearAll } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        shipping_address: '',
        phone: '',
        notes: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Validate required fields
        if (!formData.shipping_address.trim()) {
            toast.error('Please enter your shipping address');
            setLoading(false);
            return;
        }

        if (!formData.phone.trim()) {
            toast.error('Please enter your phone number');
            setLoading(false);
            return;
        }

        try {
            await checkout({
                shipping_address: formData.shipping_address,
                phone: formData.phone,
                notes: formData.notes || ''
            });

            toast.success('Order placed successfully! 🎉');
            await clearAll();
            navigate('/orders');
        } catch (error) {
            if (error.error) {
                toast.error(error.error);
            } else if (error.shipping_address) {
                toast.error('Shipping address: ' + error.shipping_address[0]);
            } else if (error.phone) {
                toast.error('Phone: ' + error.phone[0]);
            } else {
                toast.error('Checkout failed. Please check your details.');
            }
            console.error('Checkout error:', error);
        } finally {
            setLoading(false);
        }
    };

    if (!cart || cart.items?.length === 0) {
        return (
            <div className="container mx-auto px-4 py-16 text-center">
                <div className="text-6xl mb-4">🛒</div>
                <h2 className="text-2xl font-bold mb-4">Your Cart is Empty</h2>
                <p className="text-gray-600 mb-4">Add items to your cart before checking out.</p>
                <button
                    onClick={() => navigate('/products')}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                    Browse Products
                </button>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">Checkout</h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h2 className="text-lg font-bold mb-4">Shipping Information</h2>
                        
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-medium mb-1">Full Name</label>
                                <input
                                    type="text"
                                    value={user?.username || ''}
                                    disabled
                                    className="w-full px-3 py-2 border rounded-lg bg-gray-100 text-gray-600 text-sm"
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-medium mb-1">
                                    Phone Number <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                    required
                                    placeholder="Enter your phone number"
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-medium mb-1">
                                    Shipping Address <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    name="shipping_address"
                                    value={formData.shipping_address}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                    rows="3"
                                    required
                                    placeholder="Enter your full shipping address"
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-medium mb-1">Order Notes (Optional)</label>
                                <textarea
                                    name="notes"
                                    value={formData.notes}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                    rows="2"
                                    placeholder="Any special instructions?"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition disabled:opacity-50"
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Placing Order...
                                    </span>
                                ) : (
                                    'Place Order'
                                )}
                            </button>
                        </form>
                    </div>
                </div>

                <div className="lg:col-span-1">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-4">
                        <h3 className="font-bold text-lg mb-4">Order Summary</h3>
                        
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between text-gray-600">
                                <span>Items ({cart.total_items})</span>
                                <span>${cart.total_price}</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Shipping</span>
                                <span>$0.00</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Tax (15%)</span>
                                <span>${(cart.total_price * 0.15).toFixed(2)}</span>
                            </div>
                            <div className="border-t pt-2 mt-2 flex justify-between font-bold text-lg">
                                <span>Total</span>
                                <span className="text-blue-600">
                                    ${(cart.total_price * 1.15).toFixed(2)}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CheckoutPage;
