"use client";

import { useState, useEffect, useRef } from 'react';
import Modal from './ui/Modal';
import { useCustomers } from '@/hooks/useCustomers';
import { useInvoices } from '@/hooks/useInvoices';
import { Plus, Trash2, Loader2, Save, Download } from 'lucide-react';
import toast from 'react-hot-toast';

interface CreateInvoiceModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function CreateInvoiceModal({ isOpen, onClose }: CreateInvoiceModalProps) {
    const { customers } = useCustomers();
    const { createInvoice } = useInvoices();
    const [loading, setLoading] = useState(false);
    const [templates, setTemplates] = useState<{ name: string, data: any }[]>([]);

    useEffect(() => {
        const savedTemplates = JSON.parse(localStorage.getItem('invoice_templates') || '[]');
        setTemplates(savedTemplates);
    }, []);

    const saveAsTemplate = () => {
        const name = prompt('Enter template name:');
        if (!name) return;
        const newTemplates = [...templates, { name, data: formData }];
        localStorage.setItem('invoice_templates', JSON.stringify(newTemplates));
        setTemplates(newTemplates);
        toast.success('Template saved locally');
    };

    const loadTemplate = (templateData: any) => {
        setFormData(templateData);
        toast.success('Template loaded');
    };

    const [formData, setFormData] = useState({
        customer: '',
        dueDate: '',
        items: [{ description: '', quantity: 1, price: 0 }]
    });

    const handleAddItem = () => {
        setFormData({
            ...formData,
            items: [...formData.items, { description: '', quantity: 1, price: 0 }]
        });
    };

    const handleRemoveItem = (index: number) => {
        setFormData({
            ...formData,
            items: formData.items.filter((_, i) => i !== index)
        });
    };

    const handleItemChange = (index: number, field: string, value: any) => {
        const newItems = [...formData.items];
        newItems[index] = { ...newItems[index], [field]: value };
        setFormData({ ...formData, items: newItems });
    };

    const calculateTotal = () => {
        return formData.items.reduce((acc, item) => acc + (item.quantity * item.price), 0);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.customer) return toast.error('Please select a customer');
        if (formData.items.length === 0) return toast.error('Please add at least one item');

        setLoading(true);
        try {
            const total = calculateTotal();
            await createInvoice({
                ...formData,
                total,
                status: 'Draft'
            });
            onClose();
            setFormData({
                customer: '',
                dueDate: '',
                items: [{ description: '', quantity: 1, price: 0 }]
            });
        } catch (error) {
            // Error handled by hook toast
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Create New Invoice">
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Customer</label>
                        <select
                            required
                            value={formData.customer}
                            onChange={(e) => setFormData({ ...formData, customer: e.target.value })}
                            className="w-full bg-muted border-none rounded-2xl py-3 px-4 outline-none text-sm appearance-none"
                        >
                            <option value="">Select Customer</option>
                            {customers.map((c) => (
                                <option key={c._id} value={c._id}>{c.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Due Date</label>
                        <input
                            type="date"
                            required
                            value={formData.dueDate}
                            onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                            className="w-full bg-muted border-none rounded-2xl py-3 px-4 outline-none text-sm"
                        />
                    </div>
                </div>

                {templates.length > 0 && (
                    <div className="space-y-4">
                        <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Load Template</label>
                        <div className="flex flex-wrap gap-2">
                            {templates.map((t, i) => (
                                <button
                                    key={i}
                                    type="button"
                                    onClick={() => loadTemplate(t.data)}
                                    className="px-4 py-2 bg-muted rounded-xl text-xs font-bold hover:bg-primary/20 transition-all border border-transparent hover:border-primary/30"
                                >
                                    {t.name}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Invoice Items</label>
                        <button
                            type="button"
                            onClick={handleAddItem}
                            className="text-primary text-xs font-bold flex items-center gap-1 hover:underline"
                        >
                            <Plus size={14} /> Add Item
                        </button>
                    </div>

                    <div className="space-y-3">
                        {formData.items.map((item, index) => (
                            <div key={index} className="flex gap-3 items-start">
                                <div className="flex-1">
                                    <input
                                        placeholder="Description"
                                        required
                                        value={item.description}
                                        onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                                        className="w-full bg-muted border-none rounded-xl py-2 px-3 text-sm outline-none"
                                    />
                                </div>
                                <div className="w-20">
                                    <input
                                        type="number"
                                        placeholder="Qty"
                                        required
                                        min="1"
                                        value={item.quantity}
                                        onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value))}
                                        className="w-full bg-muted border-none rounded-xl py-2 px-3 text-sm outline-none"
                                    />
                                </div>
                                <div className="w-28">
                                    <input
                                        type="number"
                                        placeholder="Price"
                                        required
                                        min="0"
                                        value={item.price}
                                        onChange={(e) => handleItemChange(index, 'price', parseFloat(e.target.value))}
                                        className="w-full bg-muted border-none rounded-xl py-2 px-3 text-sm outline-none"
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={() => handleRemoveItem(index)}
                                    className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="pt-4 border-t flex justify-between items-center">
                    <div>
                        <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Total Amount</p>
                        <h4 className="text-xl font-black text-primary">${calculateTotal().toFixed(2)}</h4>
                    </div>
                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={saveAsTemplate}
                            className="bg-secondary/10 text-secondary px-4 py-3 rounded-2xl font-bold text-sm hover:bg-secondary/20 transition-all flex items-center gap-2"
                        >
                            <Save size={16} /> Save Template
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-3 rounded-2xl font-bold text-sm hover:bg-muted transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-primary text-gray-700 px-8 py-3 rounded-2xl font-bold text-sm hover:opacity-90 transition-all flex items-center gap-2 disabled:opacity-50"
                        >
                            {loading && <Loader2 className="animate-spin" size={16} />}
                            Create Invoice
                        </button>
                    </div>
                </div>
            </form>
        </Modal>
    );
}
