import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function SearchBar() {
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            navigate(`/products?search=${searchTerm}`);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex w-full">
            <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded-r-lg hover:bg-blue-600"
            >
                🔍
            </button>
        </form>
    );
}

export default SearchBar;