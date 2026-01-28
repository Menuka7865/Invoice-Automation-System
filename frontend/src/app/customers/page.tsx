"use client";

import { useState } from "react";

import { Plus, Search, Mail, Phone, Building2, MoreVertical, Edit2, Trash2, ExternalLink, Loader2, MapPin, User } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import { formatCurrency } from '@/lib/utils';
import { useCustomers } from '@/hooks/useCustomers';
import { useForm, useFieldArray } from 'react-hook-form';

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
    const { register, handleSubmit, reset, setValue, control } = useForm({
        defaultValues: {
            name: '',
            company: '',
            email: '',
            phone: '',
            address: '',
            contacts: [] as any[]
        }
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "contacts"
    });

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
        setValue('address', customer.address);
        setValue('contacts', customer.contacts || []);
        setIsModalOpen(true);
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Manage Companies</h1>
                    <p className="text-muted-foreground text-sm">Add, track, and manage your partner companies.</p>
                </div>
                <button
                    onClick={() => {
                        setEditingId(null);
                        reset();
                        setIsModalOpen(true);
                    }}
                    className="w-full sm:w-auto bg-primary text-black px-6 py-2.5 rounded-xl font-semibold shadow-lg shadow-primary/20 hover:scale-105 transition-all flex items-center justify-center gap-2 text-sm md:text-base"
                >
                    <Plus size={20} /> Add Company
                </button>
            </div>

            {/* Filter Bar */}
            <div className="bg-card p-4 rounded-2xl border shadow-sm flex flex-col md:flex-row gap-4">
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
                    <select className="flex-1 md:flex-none bg-muted border-none rounded-xl py-2 px-4 outline-none text-sm" title='option' >
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
                        <p className="font-bold">No companies found.</p>
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

                        <div>
                            <h3 className="font-bold text-lg flex items-center gap-2"><Building2 size={14} />{customer.name}</h3>
                            <div className="space-y-2 border-t pt-4">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Mail size={14} className="text-primary" /> {customer.email}
                                </div>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Phone size={14} className="text-primary" /> {customer.phone || 'N/A'}
                                </div>
                                {customer.address && (
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <MapPin size={14} className="text-primary" /> {customer.address}
                                    </div>
                                )}
                            </div>

                            {customer.contacts && customer.contacts.length > 0 && (
                                <div className="border-t pt-3 space-y-2">
                                    <p className="text-xs font-semibold uppercase text-muted-foreground tracking-wider flex items-center gap-1 bg-muted/40 p-2.5 rounded-lg">
                                        <User size={12} /> Key Contacts
                                    </p>
                                    <div className="space-y-2 max-h-[150px] overflow-y-auto pr-1 custom-scrollbar">
                                        {customer.contacts.map((contact: any, i: number) => (
                                            <div key={i} className="bg-muted/40 p-2.5 rounded-lg text-sm border hover:border-primary/20 transition-colors">
                                                <div className="flex justify-between items-start mb-1">
                                                    <span className="font-medium text-foreground">{contact.name}</span>
                                                    {contact.designation && (
                                                        <span className="text-[10px] bg-background px-1.5 py-0.5 rounded border text-muted-foreground font-medium">
                                                            {contact.designation}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="space-y-0.5">
                                                    {contact.email && (
                                                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                                            <Mail size={10} /> {contact.email}
                                                        </div>
                                                    )}
                                                    {contact.phone && (
                                                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                                            <Phone size={10} /> {contact.phone}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

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
                title={editingId ? 'Edit Company' : 'Add New Company'}
            >
                <form onSubmit={handleSubmit(editingId ? handleUpdate : handleCreate)} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-sm font-medium">Company Name</label>
                            <input {...register('name')} required type="text" className="w-full bg-muted border-none rounded-xl p-3 outline-none focus:ring-2 focus:ring-primary/20" placeholder="e.g. ABC company" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-medium">Company Address</label>
                            <input {...register('address')} required type="text" className="w-full bg-muted border-none rounded-xl p-3 outline-none focus:ring-2 focus:ring-primary/20" placeholder="123 Main St, Anytown" />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <label className="text-sm font-medium">Email Address</label>
                        <input {...register('email')} required type="email" className="w-full bg-muted border-none rounded-xl p-3 outline-none focus:ring-2 focus:ring-primary/20" placeholder="john@example.com" />
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-medium">Company Phone Number</label>
                        <input {...register('phone')} type="text" className="w-full bg-muted border-none rounded-xl p-3 outline-none focus:ring-2 focus:ring-primary/20" placeholder="+1 (555) 000-0000" />
                    </div>

                    {/* Contact Persons Section */}
                    <div className="space-y-3 pt-4 border-t">
                        <div className="flex justify-between items-center">
                            <label className="text-sm font-bold">Contact Persons</label>
                            <button
                                type="button"
                                onClick={() => append({ name: '', email: '', phone: '', designation: '' })}
                                className="text-xs bg-primary/10 text-primary px-3 py-1.5 rounded-lg hover:bg-primary/20 transition-colors font-medium flex items-center gap-1"
                            >
                                <Plus size={14} /> Add Contact
                            </button>
                        </div>

                        <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                            {fields.map((field, index) => (
                                <div key={field.id} className="bg-muted/50 p-4 rounded-xl space-y-3 relative group">
                                    <button
                                        type="button"
                                        onClick={() => remove(index)}
                                        className="absolute top-2 right-2 text-muted-foreground hover:text-destructive transition-colors opacity-0 group-hover:opacity-100"
                                    >
                                        <Trash2 size={16} />
                                    </button>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <div className="space-y-1">
                                            <label className="text-xs font-medium text-muted-foreground">Name</label>
                                            <input {...register(`contacts.${index}.name` as const)} placeholder="Name" className="w-full bg-background border-none rounded-lg p-2 text-sm outline-none focus:ring-2 focus:ring-primary/20" />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs font-medium text-muted-foreground">Designation</label>
                                            <input {...register(`contacts.${index}.designation` as const)} placeholder="Role/Title" className="w-full bg-background border-none rounded-lg p-2 text-sm outline-none focus:ring-2 focus:ring-primary/20" />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <div className="space-y-1">
                                            <label className="text-xs font-medium text-muted-foreground">Email</label>
                                            <input {...register(`contacts.${index}.email` as const)} placeholder="Email" className="w-full bg-background border-none rounded-lg p-2 text-sm outline-none focus:ring-2 focus:ring-primary/20" />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs font-medium text-muted-foreground">Phone</label>
                                            <input {...register(`contacts.${index}.phone` as const)} placeholder="Phone" className="w-full bg-background border-none rounded-lg p-2 text-sm outline-none focus:ring-2 focus:ring-primary/20" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {fields.length === 0 && (
                                <div className="text-center py-6 text-muted-foreground text-sm bg-muted/30 rounded-xl border border-dashed">
                                    No contact persons added yet.
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="pt-4 flex gap-3">
                        <button type="button" onClick={() => {
                            setIsModalOpen(false);
                            setEditingId(null);
                            reset();
                        }} className="flex-1 py-3 rounded-xl font-bold bg-muted hover:bg-muted/80 transition-all">Cancel</button>
                        <button type="submit" className="flex-1 py-3 rounded-xl font-bold bg-primary text-gray-900 hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">{editingId ? 'Update' : 'Create'} Company</button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
