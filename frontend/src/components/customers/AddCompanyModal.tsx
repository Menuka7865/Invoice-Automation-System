"use client";

import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { Plus, Trash2, Building2, Mail, Phone, MapPin, User, Loader2 } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import { useCustomers } from '@/hooks/useCustomers';

interface AddCompanyModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (newCompanyId: string) => void;
}

export default function AddCompanyModal({ isOpen, onClose, onSuccess }: AddCompanyModalProps) {
    const { createCustomer } = useCustomers();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { register, handleSubmit, reset, control, formState: { errors } } = useForm({
        defaultValues: {
            name: '',
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

    const onSubmit = async (data: any) => {
        setIsSubmitting(true);
        try {
            const result = await createCustomer(data);
            if (result && result._id) {
                onSuccess(result._id);
                reset();
                onClose();
            }
        } catch (error) {
            console.error("Failed to create company", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Add New Company"
        >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="text-sm font-medium">Company Name</label>
                        <div className="relative">
                            <Building2 className="absolute left-3 top-3 text-muted-foreground" size={16} />
                            <input
                                {...register('name', { required: true })}
                                type="text"
                                className="w-full bg-muted border-none rounded-xl py-3 pl-10 pr-4 outline-none focus:ring-2 focus:ring-primary/20 text-sm"
                                placeholder="e.g. Acme Corp"
                            />
                        </div>
                        {errors.name && <span className="text-xs text-destructive">Required</span>}
                    </div>
                    <div className="space-y-1">
                        <label className="text-sm font-medium">Company Address</label>
                        <div className="relative">
                            <MapPin className="absolute left-3 top-3 text-muted-foreground" size={16} />
                            <input
                                {...register('address')}
                                type="text"
                                className="w-full bg-muted border-none rounded-xl py-3 pl-10 pr-4 outline-none focus:ring-2 focus:ring-primary/20 text-sm"
                                placeholder="123 Main St"
                            />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="text-sm font-medium">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-3 text-muted-foreground" size={16} />
                            <input
                                {...register('email', { required: true })}
                                type="email"
                                className="w-full bg-muted border-none rounded-xl py-3 pl-10 pr-4 outline-none focus:ring-2 focus:ring-primary/20 text-sm"
                                placeholder="company@example.com"
                            />
                        </div>
                        {errors.email && <span className="text-xs text-destructive">Required</span>}
                    </div>
                    <div className="space-y-1">
                        <label className="text-sm font-medium">Phone Number</label>
                        <div className="relative">
                            <Phone className="absolute left-3 top-3 text-muted-foreground" size={16} />
                            <input
                                {...register('phone')}
                                type="text"
                                className="w-full bg-muted border-none rounded-xl py-3 pl-10 pr-4 outline-none focus:ring-2 focus:ring-primary/20 text-sm"
                                placeholder="+1 (555) 000-0000"
                            />
                        </div>
                    </div>
                </div>

                {/* Contact Persons Section */}
                <div className="space-y-3 pt-4 border-t">
                    <div className="flex justify-between items-center">
                        <label className="text-sm font-bold flex items-center gap-2">
                            <User size={16} /> Contact Persons
                        </label>
                        <button
                            type="button"
                            onClick={() => append({ name: '', email: '', phone: '', designation: '' })}
                            className="text-xs bg-primary/10 text-primary px-3 py-1.5 rounded-lg hover:bg-primary/20 transition-colors font-medium flex items-center gap-1"
                        >
                            <Plus size={14} /> Add Contact
                        </button>
                    </div>

                    <div className="space-y-3 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                        {fields.map((field, index) => (
                            <div key={field.id} className="bg-muted/30 p-3 rounded-xl space-y-2 relative group border hover:border-primary/20 transition-colors">
                                <button
                                    type="button"
                                    onClick={() => remove(index)}
                                    className="absolute top-2 right-2 text-muted-foreground hover:text-destructive transition-colors opacity-0 group-hover:opacity-100"
                                >
                                    <Trash2 size={14} />
                                </button>
                                <div className="grid grid-cols-2 gap-2">
                                    <input {...register(`contacts.${index}.name` as const)} placeholder="Name" className="bg-background rounded-lg p-2 text-xs border-none outline-none focus:ring-1 focus:ring-primary/20" />
                                    <input {...register(`contacts.${index}.designation` as const)} placeholder="Role" className="bg-background rounded-lg p-2 text-xs border-none outline-none focus:ring-1 focus:ring-primary/20" />
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <input {...register(`contacts.${index}.email` as const)} placeholder="Email" className="bg-background rounded-lg p-2 text-xs border-none outline-none focus:ring-1 focus:ring-primary/20" />
                                    <input {...register(`contacts.${index}.phone` as const)} placeholder="Phone" className="bg-background rounded-lg p-2 text-xs border-none outline-none focus:ring-1 focus:ring-primary/20" />
                                </div>
                            </div>
                        ))}
                        {fields.length === 0 && (
                            <div className="text-center py-4 text-muted-foreground text-xs bg-muted/20 rounded-xl border border-dashed">
                                No contact persons added.
                            </div>
                        )}
                    </div>
                </div>

                <div className="pt-4 flex gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 py-3 rounded-xl font-bold bg-muted hover:bg-muted/80 transition-all text-sm"
                        disabled={isSubmitting}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="flex-1 py-3 rounded-xl font-bold bg-primary text-black hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 text-sm flex items-center justify-center gap-2"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? <Loader2 className="animate-spin" size={16} /> : <Plus size={16} />}
                        Create Company
                    </button>
                </div>
            </form>
        </Modal>
    );
}
