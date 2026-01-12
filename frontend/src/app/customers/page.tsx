"use client";

import { useState } from "react";

import { Plus, Search, Mail, Phone, Building2, MoreVertical, Edit2, Trash2, ExternalLink, Loader2 } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import { formatCurrency } from '@/lib/utils';
import { useCustomers } from '@/hooks/useCustomers';
import { useForm } from 'react-hook-form';

const mockCustomers = [
    { id: '1', name: 'John Doe', company: 'Acme Corp', email: 'john@acme.com', phone: '+1 234 567 890', totalSpent: 12500, activeQuotes: 2, activeInvoices: 1 },
    { id: '2', name: 'Sarah Smith', company: 'Global Tech', email: 'sarah@globaltech.io', phone: '+1 987 654 321', totalSpent: 8900, activeQuotes: 1, activeInvoices: 3 },
    { id: '3', name: 'Mike Ross', company: 'Nexus Soft', email: 'mike@nexus.com', phone: '+1 444 555 666', totalSpent: 21000, activeQuotes: 0, activeInvoices: 0 },
    { id: '4', name: 'Harvey Specter', company: 'Pearson Hardman', email: 'harvey@ph.com', phone: '+1 000 111 222', totalSpent: 15400, activeQuotes: 3, activeInvoices: 2 },
];

export default function CustomersPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [editingId, setEditingId] = useState<string | null>(null);
    const { customers, loading, fetchCustomers, createCustomer, updateCustomer, deleteCustomer } = useCustomers();
    const { register, handleSubmit, reset, setValue } = useForm();

    const filteredCustomers = customers.filter((c: any) =>
        !searchTerm || c.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.company?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleCreate = async (data: any) => {
        await createCustomer(data);
        setIsModalOpen(false);
        reset();
    };

    const handleUpdate = async (data: any) => {
        if (editingId) {
            await updateCustomer(editingId, data);
            setEditingId(null);
        }
        setIsModalOpen(false);
        reset();
    };

    const handleEdit = (customer: any) => {
        setEditingId(customer._id);
        setValue('name', customer.name);
        setValue('company', customer.company);
        setValue('email', customer.email);
        setValue('phone', customer.phone);
        setIsModalOpen(true);
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Customer Management</h1>
                    <p className="text-muted-foreground">Add, track, and manage your partner companies.</p>
                </div>
                <button
                    onClick={() => {
                        setEditingId(null);
                        reset();
                        setIsModalOpen(true);
                    }}
                    className="bg-primary text-black px-6 py-2.5 rounded-xl font-semibold shadow-lg shadow-primary/20 hover:scale-105 transition-all flex items-center gap-2"
                >
                    <Plus size={20} /> Add Customer
                </button>
            </div>

            {/* Filter Bar */}
            <div className="bg-card p-4 rounded-2xl border shadow-sm flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-2.5 text-muted-foreground" size={18} />
                    <input
                        type="text"
                        placeholder="Search by name, email or company..."
                        className="w-full bg-muted border-none rounded-xl py-2 pl-10 pr-4 outline-none text-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex gap-2">
                    <select className="bg-muted border-none rounded-xl py-2 px-4 outline-none text-sm" title='option' >
                        <option>All Companies</option>
                        <option>Top Spending</option>
                        <option>Most Active</option>
                    </select>
                </div>
            </div>

            {/* Customers List */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {loading ? (
                    <div className="col-span-full h-64 flex flex-col items-center justify-center text-muted-foreground">
                        <Loader2 className="animate-spin mb-4" size={40} />
                        <p className="font-bold">Fetching customers...</p>
                    </div>
                ) : customers.length === 0 ? (
                    <div className="col-span-full h-64 flex flex-col items-center justify-center text-muted-foreground border-2 border-dashed rounded-[2.5rem]">
                        <p className="font-bold">No customers found.</p>
                    </div>
                ) : filteredCustomers.map((customer: any) => (
                    <div key={customer._id} className="bg-card p-6 rounded-3xl border shadow-sm hover:border-primary/40 transition-all group">
                        <div className="flex justify-between items-start mb-6">
                            <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary font-bold text-xl">
                                {customer.name?.[0]?.toUpperCase()}
                            </div>
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    title="btn1"
                                    onClick={() => handleEdit(customer)}
                                    className="p-2 hover:bg-muted rounded-full text-muted-foreground"
                                >
                                    <Edit2 size={16} />
                                </button>
                                <button
                                    title="btn2"
                                    onClick={() => deleteCustomer(customer._id)}
                                    className="p-2 hover:bg-destructive/10 rounded-full text-destructive"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <h3 className="font-bold text-lg">{customer.name}</h3>
                                <div className="flex items-center gap-1.5 text-muted-foreground text-sm mt-0.5">
                                    <Building2 size={14} /> {customer.company || 'N/A'}
                                </div>
                            </div>

                            <div className="space-y-2 border-t pt-4">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Mail size={14} className="text-primary" /> {customer.email}
                                </div>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Phone size={14} className="text-primary" /> {customer.phone || 'N/A'}
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
                title={editingId ? 'Edit Customer' : 'Add New Customer'}
            >
                <form onSubmit={handleSubmit(editingId ? handleUpdate : handleCreate)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 ">
                        <div className="space-y-1">
                            <label className="text-sm font-medium">Customer Name</label>
                            <input {...register('name')} required type="text" className="w-full bg-muted border-none rounded-xl p-3 outline-none focus:ring-2 focus:ring-primary/20" placeholder="e.g. John Doe" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-medium">Company Name</label>
                            <input {...register('company')} type="text" className="w-full bg-muted border-none rounded-xl p-3 outline-none focus:ring-2 focus:ring-primary/20" placeholder="e.g. Acme Corp" />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <label className="text-sm font-medium">Email Address</label>
                        <input {...register('email')} required type="email" className="w-full bg-muted border-none rounded-xl p-3 outline-none focus:ring-2 focus:ring-primary/20" placeholder="john@example.com" />
                    </div>
                    <div className="space-y-1">
                        <label className="text-sm font-medium">Phone Number</label>
                        <input {...register('phone')} type="text" className="w-full bg-muted border-none rounded-xl p-3 outline-none focus:ring-2 focus:ring-primary/20" placeholder="+1 (555) 000-0000" />
                    </div>
                    <div className="pt-4 flex gap-3">
                        <button type="button" onClick={() => {
                            setIsModalOpen(false);
                            setEditingId(null);
                            reset();
                        }} className="flex-1 py-3 rounded-xl font-bold bg-muted hover:bg-muted/80 transition-all">Cancel</button>
                        <button type="submit" className="flex-1 py-3 rounded-xl font-bold bg-primary text-gray-900 hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">{editingId ? 'Update' : 'Create'} Customer</button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
