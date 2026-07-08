import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMyOrders } from '../services/orderService';

function OrderHistoryPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const data = await getMyOrders();
            setOrders(data);
        } catch (error) {
            setError(error.error || 'Failed to fetch orders');
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        const colors = {
            'pending': 'bg-yellow-100 text-yellow-800',
            'processing': 'bg-blue-100 text-blue-800',
            'shipped': 'bg-purple-100 text-purple-800',
            'delivered': 'bg-green-100 text-green-800',
            'cancelled': 'bg-red-100 text-red-800'
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-16 text-center">
                <div className="text-xl text-gray-600">Loading orders...</div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Order History</h1>
            
            {error && (
                <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
                    {error}
                </div>
            )}

            {orders.length === 0 ? (
                <div className="text-center py-16">
                    <h2 className="text-2xl font-bold mb-4">No Orders Yet</h2>
                    <p className="text-gray-600 mb-4">Start shopping to place your first order!</p>
                    <Link to="/products" className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600">
                        Browse Products
                    </Link>
                </div>
            ) : (
                <div className="space-y-6">
                    {orders.map((order) => (
                        <div key={order.id} className="bg-white rounded-lg shadow overflow-hidden">
                            <div className="p-6 border-b">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h3 className="font-bold">Order #{order.order_number}</h3>
                                        <p className="text-sm text-gray-500">
                                            {new Date(order.created_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div className="flex items-center space-x-4">
                                        <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(order.status)}`}>
                                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                        </span>
                                        <span className="font-bold text-blue-600">
                                            ${order.total_amount}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="p-4">
                                <div className="space-y-2">
                                    {order.items?.map((item) => (
                                        <div key={item.id} className="flex justify-between text-sm">
                                            <span>{item.quantity} × {item.product_name}</span>
                                            <span>${item.total_price}</span>
                                        </div>
                                    ))}
                                </div>
                                
                                <div className="mt-4 pt-4 border-t text-sm">
                                    <p className="text-gray-600">
                                        📦 Shipping: {order.shipping_address}
                                    </p>
                                    <p className="text-gray-600">
                                        📞 Phone: {order.phone}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default OrderHistoryPage;
