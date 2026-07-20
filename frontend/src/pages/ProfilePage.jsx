import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getProfile } from '../services/authService';
import api from '../services/api';
import { toast } from 'react-hot-toast';
import LoadingSpinner from '../components/common/LoadingSpinner';

function ProfilePage() {
    const { user, isAuth } = useAuth();
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        profile: {
            phone: '',
            address: '',
            city: '',
            country: ''
        }
    });

    useEffect(() => {
        if (isAuth) {
            fetchProfile();
        }
    }, [isAuth]);

    const fetchProfile = async () => {
        try {
            const data = await getProfile();
            setFormData({
                first_name: data.first_name || '',
                last_name: data.last_name || '',
                email: data.email || '',
                profile: {
                    phone: data.profile?.phone || '',
                    address: data.profile?.address || '',
                    city: data.profile?.city || '',
                    country: data.profile?.country || 'Ethiopia'
                }
            });
        } catch (error) {
            toast.error('Failed to load profile');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.startsWith('profile.')) {
            const field = name.split('.')[1];
            setFormData({
                ...formData,
                profile: {
                    ...formData.profile,
                    [field]: value
                }
            });
        } else {
            setFormData({
                ...formData,
                [name]: value
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await api.put('/auth/profile/', formData);
            if (response.status === 200) {
                toast.success('Profile updated successfully!');
                await fetchProfile();
            } else {
                toast.error('Failed to update profile');
            }
        } catch (error) {
            toast.error('Network error');
        } finally {
            setLoading(false);
        }
    };

    if (!isAuth) {
        return (
            <div className="container mx-auto px-4 py-16 text-center">
                <h2 className="text-2xl font-bold mb-4">Please Login</h2>
                <a href="/login" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
                    Login
                </a>
            </div>
        );
    }

    if (loading) return <LoadingSpinner />;

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">My Profile</h1>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 max-w-2xl">
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-gray-700 text-sm font-medium mb-1">First Name</label>
                            <input
                                type="text"
                                name="first_name"
                                value={formData.first_name}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm font-medium mb-1">Last Name</label>
                            <input
                                type="text"
                                name="last_name"
                                value={formData.last_name}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            />
                        </div>
                    </div>

                    <div className="mt-4">
                        <label className="block text-gray-700 text-sm font-medium mb-1">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        />
                    </div>

                    <div className="mt-4">
                        <label className="block text-gray-700 text-sm font-medium mb-1">Phone</label>
                        <input
                            type="text"
                            name="profile.phone"
                            value={formData.profile.phone}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        />
                    </div>

                    <div className="mt-4">
                        <label className="block text-gray-700 text-sm font-medium mb-1">Address</label>
                        <textarea
                            name="profile.address"
                            value={formData.profile.address}
                            onChange={handleChange}
                            rows="3"
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-4">
                        <div>
                            <label className="block text-gray-700 text-sm font-medium mb-1">City</label>
                            <input
                                type="text"
                                name="profile.city"
                                value={formData.profile.city}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm font-medium mb-1">Country</label>
                            <input
                                type="text"
                                name="profile.country"
                                value={formData.profile.country}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="mt-6 w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition disabled:opacity-50"
                    >
                        {loading ? 'Updating...' : 'Update Profile'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default ProfilePage;