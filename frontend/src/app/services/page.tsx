
"use client";

import { useState } from "react";
import { Plus, Search, Edit2, Trash2, Package, Tag, Layers, Loader2 } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import { formatCurrency } from '@/lib/utils';
import { useServices } from '@/hooks/useServices';
import { useCompanyProfile } from '@/hooks/useCompanyProfile';
import { useForm } from 'react-hook-form';

export default function ServicesPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [editingId, setEditingId] = useState<string | null>(null);
    const { services, loading, createService, updateService, deleteService } = useServices();
    const { profile: companyProfile } = useCompanyProfile();
    const { register, handleSubmit, reset, setValue } = useForm();

    const filteredServices = services.filter((s: any) =>
        !searchTerm || s.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleCreate = async (data: any) => {
        await createService(data);
        setIsModalOpen(false);
        reset();
    };

    const handleUpdate = async (data: any) => {
        if (editingId) {
            await updateService(editingId, data);
            setEditingId(null);
        }
        setIsModalOpen(false);
        reset();
    };

    const handleEdit = (service: any) => {
        setEditingId(service._id);
        setValue('name', service.name);
        setValue('description', service.description);
        setValue('price', service.price);
        setValue('status', service.status);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this service?')) {
            await deleteService(id);
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Services Management</h1>
                    <p className="text-muted-foreground">Manage your company's service offerings.</p>
                </div>
                <button
                    onClick={() => {
                        setEditingId(null);
                        reset();
                        setIsModalOpen(true);
                    }}
                    className="bg-primary text-black px-6 py-2.5 rounded-xl font-semibold shadow-lg shadow-primary/20 hover:scale-105 transition-all flex items-center gap-2"
                >
                    <Plus size={20} /> Add Service
                </button>
            </div>

            {/* Filter Bar */}
            <div className="bg-card p-4 rounded-2xl border shadow-sm flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-2.5 text-muted-foreground" size={18} />
                    <input
                        type="text"
                        placeholder="Search services..."
                        className="w-full bg-muted border-none rounded-xl py-2 pl-10 pr-4 outline-none text-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Services List */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {loading ? (
                    <div className="col-span-full h-64 flex flex-col items-center justify-center text-muted-foreground">
                        <Loader2 className="animate-spin mb-4" size={40} />
                        <p className="font-bold">Fetching services...</p>
                    </div>
                ) : services.length === 0 ? (
                    <div className="col-span-full h-64 flex flex-col items-center justify-center text-muted-foreground border-2 border-dashed rounded-[2.5rem]">
                        <p className="font-bold">No services found.</p>
                    </div>
                ) : filteredServices.map((service: any) => (
                    <div key={service._id} className="bg-card p-6 rounded-3xl border shadow-sm hover:border-primary/40 transition-all group">
                        <div className="flex justify-between items-start mb-6">
                            <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary font-bold text-xl">
                                <Package size={28} />
                            </div>
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={() => handleEdit(service)}
                                    className="p-2 hover:bg-muted rounded-full text-muted-foreground"
                                >
                                    <Edit2 size={16} />
                                </button>
                                <button
                                    onClick={() => handleDelete(service._id)}
                                    className="p-2 hover:bg-destructive/10 rounded-full text-destructive"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <h3 className="font-bold text-lg">{service.name}</h3>
                                <div className="flex items-center gap-1.5 text-muted-foreground text-sm mt-0.5 line-clamp-2 min-h-10">
                                    {service.description || 'No description provided.'}
                                </div>
                            </div>

                            <div className="space-y-2 border-t pt-4">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground flex items-center gap-2">
                                        <Tag size={14} className="text-primary" /> Price
                                    </span>
                                    <span className="font-bold text-lg">{formatCurrency(service.price, companyProfile?.currency)}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground flex items-center gap-2">
                                        <Layers size={14} className="text-primary" /> Status
                                    </span>
                                    <span className={`px-2 py-0.5 rounded-md text-xs font-medium ${service.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'} capitalize`}>
                                        {service.status || 'Active'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setEditingId(null);
                    reset();
                }}
                title={editingId ? 'Edit Service' : 'Add New Service'}
            >
                <form onSubmit={handleSubmit(editingId ? handleUpdate : handleCreate)} className="space-y-4">
                    <div className="space-y-1">
                        <label className="text-sm font-medium">Service Name</label>
                        <input {...register('name')} required type="text" className="w-full bg-muted border-none rounded-xl p-3 outline-none focus:ring-2 focus:ring-primary/20" placeholder="e.g. Web Development" />
                    </div>
                    <div className="space-y-1">
                        <label className="text-sm font-medium">Description</label>
                        <textarea {...register('description')} className="w-full bg-muted border-none rounded-xl p-3 outline-none focus:ring-2 focus:ring-primary/20 min-h-[100px]" placeholder="Service details..." />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-sm font-medium">Price</label>
                            <input {...register('price')} required type="number" step="0.01" className="w-full bg-muted border-none rounded-xl p-3 outline-none focus:ring-2 focus:ring-primary/20" placeholder="0.00" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-medium">Status</label>
                            <select {...register('status')} className="w-full bg-muted border-none rounded-xl p-3 outline-none focus:ring-2 focus:ring-primary/20">
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>
                        </div>
                    </div>

                    <div className="pt-4 flex gap-3">
                        <button type="button" onClick={() => {
                            setIsModalOpen(false);
                            setEditingId(null);
                            reset();
                        }} className="flex-1 py-3 rounded-xl font-bold bg-muted hover:bg-muted/80 transition-all">Cancel</button>
                        <button type="submit" className="flex-1 py-3 rounded-xl font-bold bg-primary text-gray-900 hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">{editingId ? 'Update' : 'Create'} Service</button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
