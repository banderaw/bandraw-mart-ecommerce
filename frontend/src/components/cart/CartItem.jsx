import React, { useState } from 'react';
import { useCart } from '../../contexts/CartContext';
import { getImageUrl } from '../../utils/imageHelper';

function CartItem({ item }) {
    const [quantity, setQuantity] = useState(item.quantity);
    const [updating, setUpdating] = useState(false);
    const { updateItem, removeItem } = useCart();

    const handleUpdateQuantity = async (newQuantity) => {
        if (newQuantity < 1) {
            handleRemove();
            return;
        }
        
        setUpdating(true);
        setQuantity(newQuantity);
        await updateItem(item.id, newQuantity);
        setUpdating(false);
    };

    const handleRemove = async () => {
        if (window.confirm('Remove this item from cart?')) {
            await removeItem(item.id);
        }
    };

    return (
        <div className="bg-white p-4 rounded-lg shadow mb-4 flex items-center">
            <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center mr-4">
                {item.product_detail?.image ? (
                    <img 
                        src={getImageUrl(item.product_detail.image)} 
                        alt={item.product_detail?.name}
                        className="w-full h-full object-cover rounded-lg"
                    />
                ) : (
                    <span className="text-2xl">📦</span>
                )}
            </div>
            
            <div className="flex-1">
                <h3 className="font-semibold">{item.product_detail?.name}</h3>
                <p className="text-gray-600 text-sm">${item.product_detail?.final_price}</p>
            </div>
            
            <div className="flex items-center space-x-3">
                <div className="flex items-center border rounded">
                    <button
                        onClick={() => handleUpdateQuantity(quantity - 1)}
                        disabled={updating}
                        className="px-3 py-1 hover:bg-gray-100 disabled:opacity-50"
                    >
                        -
                    </button>
                    <span className="px-4 py-1">{quantity}</span>
                    <button
                        onClick={() => handleUpdateQuantity(quantity + 1)}
                        disabled={updating}
                        className="px-3 py-1 hover:bg-gray-100 disabled:opacity-50"
                    >
                        +
                    </button>
                </div>
                
                <div className="text-right">
                    <div className="font-bold text-blue-600">
                        ${item.total_price}
                    </div>
                    <button
                        onClick={handleRemove}
                        className="text-red-500 text-sm hover:underline"
                    >
                        Remove
                    </button>
                </div>
            </div>
        </div>
    );
}

export default CartItem;