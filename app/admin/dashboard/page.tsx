'use client';


import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { type Property, formatPrice, getPropertyFallbackImage } from '@/lib/properties';
// import router from "next/router";

export default function AdminDashboard() {
    const [properties, setProperties] = useState<Property[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [editingProperty, setEditingProperty] = useState<Property | null>(null);
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isUploading, setIsUploading] = useState(false);
    const [formData, setFormData] = useState<Partial<Property>>({
        title: '',
        price: 0,
        location: '',
        type: 'House',
        status: 'For Sale',
        bedrooms: 0,
        bathrooms: 0,
        area: 0,
        areaUnit: 'sqft',
        featured: false,
        images: [],
        description: '',
        yearBuilt: new Date().getFullYear(),
        parking: 0,
    });

    useEffect(() => {
        fetchProperties();
    }, []);

    const fetchProperties = async () => {
        try {
            setIsLoading(true);
            const res = await fetch('/api/properties');
            if (!res.ok) throw new Error('Failed to fetch properties');
            const data = await res.json();
            setProperties(data);
        } catch (error) {
            console.error('Error fetching properties:', error);
            alert('Failed to load properties');
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked :
                type === 'number' ? parseFloat(value) || 0 : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            if (editingProperty) {
                const res = await fetch(`/api/properties/${editingProperty.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData),
                });
                if (!res.ok) throw new Error('Failed to update property');
            } else {
                const res = await fetch('/api/properties', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData),
                });
                if (!res.ok) throw new Error('Failed to create property');
            }

            fetchProperties();
            closeModal();
        } catch (error) {
            console.error('Error saving property:', error);
            alert('Failed to save property');
        }
    };

    const handleEdit = (property: Property) => {
        setEditingProperty(property);
        setFormData(property);
        setShowModal(true);
    };

    const handleDelete = (id: number) => {
        setDeleteId(id);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        if (deleteId !== null) {
            try {
                const res = await fetch(`/api/properties/${deleteId}`, {
                    method: 'DELETE',
                });
                if (!res.ok) throw new Error('Failed to delete property');

                fetchProperties();
                alert('Property deleted successfully');
                setShowDeleteModal(false);
                setDeleteId(null);
            } catch (error) {
                console.error('Error deleting property:', error);
                alert('Failed to delete property');
            }
        }
    };

    const openModal = () => {
        setEditingProperty(null);
        setFormData({
            title: '',
            price: 0,
            location: '',
            type: 'House',
            status: 'For Sale',
            bedrooms: 0,
            bathrooms: 0,
            area: 0,
            areaUnit: 'sqft',
            featured: false,
            images: [],
            description: '',
            yearBuilt: new Date().getFullYear(),
            parking: 0,
        });
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingProperty(null);
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;

        const currentImagesCount = formData.images?.length || 0;
        const remainingSlots = 5 - currentImagesCount;

        if (remainingSlots <= 0) {
            alert('Maximum 5 images allowed');
            return;
        }

        const files = Array.from(e.target.files).slice(0, remainingSlots);
        setIsUploading(true);

        try {
            const uploadUrl = process.env.NEXT_PUBLIC_UPLOAD_API_URL || '/api/upload';
            const newImageUrls: string[] = [];

            for (const file of files) {
                if (file.size > 5 * 1024 * 1024) {
                    alert(`File ${file.name} exceeds 5MB limit`);
                    continue;
                }

                const uploadFormData = new FormData();
                uploadFormData.append('file', file);

                const res = await fetch(uploadUrl, {
                    method: 'POST',
                    body: uploadFormData,
                });

                if (!res.ok) throw new Error(`Upload failed for ${file.name}`);

                const data = await res.json();
                if (data.success) {
                    newImageUrls.push(data.url);
                } else {
                    alert('Upload failed: ' + data.message);
                }
            }

            if (newImageUrls.length > 0) {
                setFormData(prev => ({
                    ...prev,
                    images: [...(prev.images || []), ...newImageUrls]
                }));
            }
        } catch (error: any) {
            console.error('Error uploading images:', error);
            alert('Error uploading images: ' + (error.message || 'Unknown error'));
        } finally {
            setIsUploading(false);
        }
    };

    const handleLogout = async () => {
        try {
            await fetch('/api/logout', { method: 'POST' });
            window.location.href = '/login';
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    const stats = [
        { label: 'Total Properties', value: properties.length, icon: 'fa-home', color: 'primary' },
        { label: 'For Sale', value: properties.filter(p => p.status === 'For Sale').length, icon: 'fa-tag', color: 'success' },
        { label: 'For Rent', value: properties.filter(p => p.status === 'For Rent').length, icon: 'fa-key', color: 'info' },
        { label: 'Featured', value: properties.filter(p => p.featured).length, icon: 'fa-star', color: 'warning' },
    ];

    if (isLoading) {
        return <div className="flex h-screen items-center justify-center">Loading...</div>;
    }

    return (
        <>
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />

            <div className="flex min-h-screen bg-gray-50">
                {/* Sidebar */}
                <aside className="w-64 bg-secondary text-white p-6 sticky top-0 h-screen overflow-y-auto">
                    <div className="text-2xl font-bold mb-8 text-center pb-6 border-b border-white/10">
                        Veer<span className="text-primary"> Real Estate</span>
                    </div>

                    <nav>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/admin/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-lg bg-primary text-secondary font-medium">
                                    <i className="fas fa-tachometer-alt w-5"></i>
                                    Dashboard
                                </Link>
                            </li>
                            <li>
                                <Link href="/" className="flex items-center gap-3 px-4 py-3 rounded-lg text-white hover:bg-primary  transition-colors">
                                    <i className="fas fa-globe w-5"></i>
                                    View Website
                                </Link>
                            </li>
                            <li>
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-white hover:bg-red-500 hover:text-white transition-colors text-left"
                                >
                                    <i className="fas fa-sign-out-alt w-5"></i>
                                    Logout
                                </button>
                            </li>

                            {/* <li>
                                <Link href="/admin/dashboard/register" className="flex items-center gap-3 px-4 py-3 rounded-lg text-white/80 hover:bg-primary hover:text-secondary transition-colors">
                                    <i className="fas fa-user-plus w-5"></i>
                                    Create Account
                                </Link>
                            </li> */}
                        </ul>
                    </nav>
                </aside>

                {/* Main Content */}
                <main className="flex-1 p-8 overflow-y-auto">
                    {/* Header */}
                    <div className="bg-white rounded-xl p-6 shadow-sm mb-8 flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold text-secondary">Property Management</h1>
                            <p className="text-gray-600 mt-1">Manage your real estate listings</p>
                        </div>
                        <button
                            onClick={openModal}
                            className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors flex items-center gap-2"
                        >
                            <i className="fas fa-plus"></i>
                            Add Property
                        </button>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {stats.map((stat, index) => (
                            <div key={index} className="bg-white rounded-xl p-6 shadow-sm flex items-center gap-4">
                                <div className={`w-16 h-16 rounded-lg flex items-center justify-center text-2xl bg-${stat.color}/10 text-${stat.color}`} style={{
                                    backgroundColor: stat.color === 'primary' ? 'rgba(197, 211, 58, 0.1)' :
                                        stat.color === 'success' ? 'rgba(40, 167, 69, 0.1)' :
                                            stat.color === 'info' ? 'rgba(23, 162, 184, 0.1)' :
                                                'rgba(255, 193, 7, 0.1)',
                                    color: stat.color === 'primary' ? '#C5D33A' :
                                        stat.color === 'success' ? '#28A745' :
                                            stat.color === 'info' ? '#17A2B8' :
                                                '#FFC107'
                                }}>
                                    <i className={`fas ${stat.icon}`}></i>
                                </div>
                                <div>
                                    <div className="text-3xl font-bold text-secondary">{stat.value}</div>
                                    <div className="text-gray-600 text-sm">{stat.label}</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Properties Table */}
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-gray-200">
                            <h2 className="text-xl font-semibold text-secondary">All Properties</h2>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-secondary">Image</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-secondary">Title</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-secondary">Type</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-secondary">Price</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-secondary">Status</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-secondary">Location</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-secondary">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {properties.map((property) => (
                                        <tr key={property.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="relative w-20 h-20 rounded-lg overflow-hidden">
                                                    <img
                                                        src={property.images?.[0] || getPropertyFallbackImage(property.type)}
                                                        alt={property.title}
                                                        className="object-cover"
                                                    />
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="font-medium text-secondary">{property.title}</div>
                                                {property.featured && (
                                                    <span className="inline-block mt-1 text-xs bg-primary/20 text-primary px-2 py-0.5 rounded">
                                                        Featured
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-gray-600">{property.type}</td>
                                            <td className="px-6 py-4 font-semibold text-primary">
                                                {formatPrice(property.price)}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${property.status === 'For Sale'
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-blue-100 text-blue-700'
                                                    }`}>
                                                    {property.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-gray-600">{property.location}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex gap-2">
                                                    <Link
                                                        href={`/properties/${property.id}`}
                                                        className="w-9 h-9 flex items-center justify-center rounded-lg bg-green-500 text-white hover:bg-green-600 transition-colors"
                                                    >
                                                        <i className="fas fa-eye"></i>
                                                    </Link>
                                                    <button
                                                        onClick={() => handleEdit(property)}
                                                        className="w-9 h-9 flex items-center justify-center rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors"
                                                    >
                                                        <i className="fas fa-edit"></i>
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDelete(property.id)}
                                                        className="w-9 h-9 flex items-center justify-center rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors"
                                                    >
                                                        <i className="fas fa-trash"></i>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </main>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white">
                            <h2 className="text-2xl font-bold text-secondary">
                                {editingProperty ? 'Edit Property' : 'Add New Property'}
                            </h2>
                            <button
                                onClick={closeModal}
                                className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-600 transition-colors"
                            >
                                <i className="fas fa-times text-xl"></i>
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Price (INR)</label>
                                    <input
                                        type="number"
                                        name="price"
                                        value={formData.price}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                                    <input
                                        type="text"
                                        name="location"
                                        value={formData.location}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Property Type</label>
                                    <select
                                        name="type"
                                        value={formData.type}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                                    >
                                        <option value="Apartment">Apartment</option>
                                        <option value="Commercial">Commercial Shops</option>
                                        <option value="Commercial">Commercial Office</option>
                                        <option value="Industrial">Industrial</option>
                                        <option value="Banglow">Bunglow</option>
                                        <option value="Land">Land</option>
                                        <option value="Plot">Plot</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                                    <select
                                        name="status"
                                        value={formData.status}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                                    >
                                        <option value="For Sale">For Sale</option>
                                        <option value="For Rent">For Rent</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Bedrooms</label>
                                    <input
                                        type="number"
                                        name="bedrooms"
                                        value={formData.bedrooms}
                                        onChange={handleInputChange}
                                        min="0"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Bathrooms</label>
                                    <input
                                        type="number"
                                        name="bathrooms"
                                        value={formData.bathrooms}
                                        onChange={handleInputChange}
                                        min="0"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Size</label>
                                    <div className="flex">
                                        <input
                                            type="number"
                                            name="area"
                                            value={formData.area}
                                            onChange={handleInputChange}
                                            min="0"
                                            className="flex-1 px-4 py-3 border border-gray-300 rounded-l-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                                            placeholder="Enter size"
                                        />
                                        <select
                                            name="areaUnit"
                                            value={formData.areaUnit || 'sqft'}
                                            onChange={handleInputChange}
                                            className="w-32 px-4 py-3 border border-l-0 border-gray-300 rounded-r-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 bg-gray-50"
                                        >
                                            <option value="sqft">sqft</option>
                                            <option value="sqyard">sqyard</option>
                                            <option value="sqmeter">sqmeter</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Year Built</label>
                                    <input
                                        type="number"
                                        name="yearBuilt"
                                        value={formData.yearBuilt}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Parking Spaces</label>
                                    <input
                                        type="number"
                                        name="parking"
                                        value={formData.parking}
                                        onChange={handleInputChange}
                                        min="0"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Property Images ({formData.images?.length || 0}/5)
                                    </label>

                                    {/* Previews Grid */}
                                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                                        {(formData.images || []).map((url, index) => (
                                            <div key={index} className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 group">
                                                <img
                                                    src={url}
                                                    alt={`Preview ${index + 1}`}
                                                    className="object-cover"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setFormData(prev => ({
                                                        ...prev,
                                                        images: prev.images?.filter((_, i) => i !== index)
                                                    }))}
                                                    className="absolute top-1 right-1 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100 shadow-md"
                                                >
                                                    <i className="fas fa-times text-xs"></i>
                                                </button>
                                                {index === 0 && (
                                                    <div className="absolute bottom-0 left-0 right-0 bg-primary/80 text-white text-[10px] text-center py-0.5">
                                                        Main Image
                                                    </div>
                                                )}
                                            </div>
                                        ))}

                                        {/* Upload Button */}
                                        {(formData.images?.length || 0) < 5 && (
                                            <label className={`aspect-square flex flex-col items-center justify-center border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}>
                                                <div className="flex flex-col items-center justify-center">
                                                    {isUploading ? (
                                                        <i className="fas fa-spinner fa-spin text-xl text-primary"></i>
                                                    ) : (
                                                        <i className="fas fa-plus text-xl text-gray-400"></i>
                                                    )}
                                                </div>
                                                <input
                                                    type="file"
                                                    className="hidden"
                                                    accept="image/*"
                                                    multiple
                                                    onChange={handleImageUpload}
                                                    disabled={isUploading}
                                                />
                                            </label>
                                        )}
                                    </div>
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        rows={4}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                                    ></textarea>
                                </div>

                                <div className="md:col-span-2">
                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            name="featured"
                                            checked={formData.featured}
                                            onChange={handleInputChange}
                                            className="w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary"
                                        />
                                        <span className="text-sm font-medium text-gray-700">Mark as Featured Property</span>
                                    </label>
                                </div>
                            </div>

                            <div className="flex gap-4 mt-8">
                                <button
                                    type="submit"
                                    className="flex-1 bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors"
                                >
                                    {editingProperty ? 'Update Property' : 'Add Property'}
                                </button>
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="px-8 py-3 rounded-lg font-semibold border-2 border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 w-96">
                        <h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
                        <p className="mb-6">Are you sure you want to delete this property?</p>
                        <div className="flex justify-end gap-4">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

