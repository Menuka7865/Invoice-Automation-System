"use client";
import { useState, useEffect, useRef } from 'react';
import { Plus, Trash2, Send, Save, ArrowLeft, Building2, Calendar, FileText, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useForm, useFieldArray } from 'react-hook-form';
import toast from 'react-hot-toast';
import { formatCurrency } from '@/lib/utils';
import Link from 'next/link';
import Modal from '@/components/ui/Modal';
import QuotationPreview from '@/components/quotations/QuotationPreview';
import VersionHistory, { VersionEntry } from '@/components/quotations/VersionHistory';
import { Eye, History as HistoryIcon } from 'lucide-react';
import { useCustomers } from '@/hooks/useCustomers';
import { useQuotations } from '@/hooks/useInvoices';

export default function NewQuotationPage() {
    const router = useRouter();
    const { customers, fetchCustomers } = useCustomers();
    const { createQuotation } = useQuotations();
    const [logoPreview, setLogoPreview] = useState<string | null>(null);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);
    const [history, setHistory] = useState<VersionEntry[]>([]);

    useEffect(() => {
        fetchCustomers();
    }, []);

    // Tracks the last captured state to detect changes
    const lastStateRef = useRef<any>(null);

    const { register, control, handleSubmit, watch, setValue } = useForm({
        defaultValues: {
            customer: '',
            date: new Date().toISOString().split('T')[0],
            items: [{ description: '', quantity: 1, price: 0 }],
            taxRate: 10,
            logo: null,
            version: '1.0'
        }
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "items"
    });

    const formData = watch();
    const items = formData.items;
    const taxRate = formData.taxRate;
    const subtotal = items.reduce((acc: number, item: any) => acc + (Number(item.quantity) * Number(item.price) || 0), 0);
    const tax = subtotal * (Number(taxRate) / 100);
    const total = subtotal + tax;

    // Change Detection Logic
    useEffect(() => {
        const timer = setTimeout(() => {
            if (!lastStateRef.current) {
                lastStateRef.current = formData;
                return;
            }

            let changeReason = "";
            if (formData.customer !== lastStateRef.current.customer) {
                changeReason = "Updated Customer Selection";
            } else if (formData.taxRate !== lastStateRef.current.taxRate) {
                changeReason = `Adjusted Tax Rate to ${formData.taxRate}%`;
            } else if (formData.items.length !== lastStateRef.current.items.length) {
                changeReason = formData.items.length > lastStateRef.current.items.length ? "Added Line Item" : "Removed Line Item";
            } else {
                // Check for individual item changes
                const itemChanged = formData.items.some((item, idx) => {
                    const lastItem = lastStateRef.current?.items[idx];
                    return lastItem && (item.description !== lastItem.description || item.price !== lastItem.price || item.quantity !== lastItem.quantity);
                });
                if (itemChanged) changeReason = "Modified Item Details";
            }

            if (changeReason) {
                const newEntry: VersionEntry = {
                    id: Math.random().toString(36).substr(2, 9),
                    action: changeReason,
                    timestamp: new Date().toISOString(),
                    userName: "Current User"
                };
                setHistory(prev => [newEntry, ...prev]);
                lastStateRef.current = formData;
            }
        }, 1000); // Debounce detect

        return () => clearTimeout(timer);
    }, [formData]);

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const result = reader.result as string;
                setLogoPreview(result);
                setValue('logo', result as any);

                // Manually log logo change since watch might not catch base64 immediately
                setHistory(prev => [{
                    id: Math.random().toString(36).substr(2, 9),
                    action: "Uploaded Company Logo",
                    timestamp: new Date().toISOString(),
                    userName: "Current User"
                }, ...prev]);
            };
            reader.readAsDataURL(file);
        }
    };

    const onSave = async (data: any, isDraft = false) => {
        try {
            const finalData = {
                ...data,
                history,
                status: isDraft ? 'Draft' : 'Sent',
                total
            };
            await createQuotation(finalData);
            router.push('/quotations');
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="max-w-7xl mx-auto space-y-8 pb-12 px-4 flex gap-8">
            <div className={`grow space-y-8 transition-all duration-500 ${isHistoryOpen ? 'mr-0' : ''}`}>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/quotations" className="p-2 hover:bg-muted rounded-full transition-colors focus:ring-2 focus:ring-primary/20 outline-none">
                            <ArrowLeft size={20} />
                        </Link>
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="text-3xl font-bold tracking-tight text-foreground">Create New Quotation</h1>
                                <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-black rounded-full uppercase tracking-widest border border-primary/20">v{formData.version}</span>
                            </div>
                            <p className="text-muted-foreground">Draft a new proposal for your customer.</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={() => setIsHistoryOpen(!isHistoryOpen)}
                            className={`p-3 rounded-2xl transition-all border ${isHistoryOpen ? 'bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20' : 'bg-card border-border hover:border-primary/50 text-muted-foreground'}`}
                        >
                            <HistoryIcon size={20} />
                        </button>

                        {/* Logo Upload Section */}
                        <div className="relative group">
                            <input
                                type="file"
                                id="logo-upload"
                                className="hidden"
                                accept="image/*"
                                onChange={handleLogoChange}
                            />
                            <label
                                htmlFor="logo-upload"
                                className="flex flex-col items-center justify-center w-16 h-16 border-2 border-dashed border-muted-foreground/30 rounded-2xl cursor-pointer hover:border-primary/50 hover:bg-muted/30 transition-all overflow-hidden relative"
                            >
                                {logoPreview ? (
                                    <>
                                        <img src={logoPreview} alt="Company Logo" className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <p className="text-white text-[8px] font-bold font-sans">Change</p>
                                        </div>
                                    </>
                                ) : (
                                    <div className="text-center p-1">
                                        <Plus size={16} className="mx-auto text-muted-foreground" />
                                        <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest leading-tight font-sans">Logo</p>
                                    </div>
                                )}
                            </label>
                        </div>
                    </div>
                </div>

                <form className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Customer & Info */}
                        <div className="bg-card/50 backdrop-blur-sm p-8 rounded-3xl border border-border/50 shadow-sm space-y-6">
                            <h3 className="font-bold flex items-center gap-2 mb-4">
                                <Building2 size={18} className="text-primary" /> Customer Information
                            </h3>
                            <div className="space-y-4">
                                <div className="space-y-1">
                                    <label className="text-sm font-medium">Select Customer</label>
                                    <select
                                        {...register('customer', { required: true })}
                                        className="w-full bg-muted/50 border border-transparent rounded-xl p-3 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/20 transition-all font-sans"
                                    >
                                        <option value="">Select a customer...</option>
                                        {customers.map((c) => (
                                            <option key={c._id} value={c._id}>{c.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm font-medium">Quotation Date</label>
                                    <div className="relative">
                                        <Calendar className="absolute left-3 top-3 text-muted-foreground" size={18} />
                                        <input
                                            type="date"
                                            {...register('date')}
                                            className="w-full bg-muted/50 border border-transparent rounded-xl py-3 pl-10 pr-4 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/20 transition-all font-sans"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Quotation Details */}
                        <div className="bg-card/50 backdrop-blur-sm p-8 rounded-3xl border border-border/50 shadow-sm space-y-6">
                            <h3 className="font-bold flex items-center gap-2 mb-4 text-foreground">
                                <FileText size={18} className="text-primary" /> Proposal Settings
                            </h3>
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-sm font-medium">Currency</label>
                                        <select className="w-full bg-muted/50 border border-transparent rounded-xl p-3 outline-none focus:ring-2 focus:ring-primary/20 transition-all font-sans">
                                            <option>USD ($)</option>
                                            <option>EUR (€)</option>
                                            <option>GBP (£)</option>
                                        </select>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-sm font-medium">Tax Percentage (%)</label>
                                        <input
                                            type="number"
                                            min="0"
                                            max="100"
                                            {...register('taxRate')}
                                            className="w-full bg-muted/50 border border-transparent rounded-xl p-3 outline-none focus:ring-2 focus:ring-primary/20 transition-all font-sans"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm font-medium">Terms & Conditions</label>
                                    <textarea
                                        className="w-full bg-muted/50 border border-transparent rounded-xl p-3 outline-none focus:ring-2 focus:ring-primary/20 min-h-[90px] transition-all font-sans"
                                        placeholder="Default company terms..."
                                    ></textarea>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Line Items */}
                    <div className="bg-card/50 backdrop-blur-sm p-8 rounded-3xl border border-border/50 shadow-sm">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-bold text-foreground">Items & Services</h3>
                            <button
                                type="button"
                                onClick={() => append({ description: '', quantity: 1, price: 0 })}
                                className="text-primary font-bold text-sm flex items-center gap-2 hover:underline focus:ring-2 focus:ring-primary/10 rounded px-2"
                            >
                                <Plus size={16} /> Add Item
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div className="grid grid-cols-12 gap-4 text-xs font-bold text-muted-foreground uppercase px-4">
                                <div className="col-span-6">Description</div>
                                <div className="col-span-2 text-center">Quantity</div>
                                <div className="col-span-3 text-right">Unit Price</div>
                                <div className="col-span-1"></div>
                            </div>

                            {fields.map((field, index) => (
                                <div key={field.id} className="grid grid-cols-12 gap-4 items-center animate-in fade-in slide-in-from-top-1">
                                    <div className="col-span-6">
                                        <input
                                            {...register(`items.${index}.description` as const)}
                                            placeholder="Item or service description..."
                                            className="w-full bg-muted/50 border border-transparent rounded-xl p-3 outline-none focus:ring-2 focus:ring-primary/20 transition-all font-sans"
                                        />
                                    </div>
                                    <div className="col-span-2">
                                        <input
                                            type="number"
                                            {...register(`items.${index}.quantity` as const)}
                                            className="w-full bg-muted/50 border border-transparent rounded-xl p-3 outline-none focus:ring-2 focus:ring-primary/20 text-center transition-all font-sans"
                                        />
                                    </div>
                                    <div className="col-span-3">
                                        <input
                                            type="number"
                                            {...register(`items.${index}.price` as const)}
                                            className="w-full bg-muted/50 border border-transparent rounded-xl p-3 outline-none focus:ring-2 focus:ring-primary/20 transition-all text-right font-sans"
                                        />
                                    </div>
                                    <div className="col-span-1 flex justify-center">
                                        <button
                                            type="button"
                                            onClick={() => remove(index)}
                                            className="p-2 text-muted-foreground hover:text-destructive transition-colors focus:ring-2 focus:ring-destructive/20 rounded-full"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Totals */}
                        <div className="mt-12 flex justify-end">
                            <div className="w-full max-w-xs space-y-3">
                                <div className="flex justify-between text-muted-foreground">
                                    <span>Subtotal</span>
                                    <span className="font-bold text-foreground">{formatCurrency(subtotal)}</span>
                                </div>
                                <div className="flex justify-between text-muted-foreground items-center">
                                    <span>Tax ({taxRate}%)</span>
                                    <span className="font-bold text-foreground">{formatCurrency(tax)}</span>
                                </div>
                                <div className="flex justify-between text-xl border-t border-border/50 pt-4">
                                    <span className="font-bold text-foreground">Total Amount</span>
                                    <span className="font-black text-primary">{formatCurrency(total)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="flex justify-end gap-4 overflow-hidden py-2">
                        <button
                            type="button"
                            onClick={() => setIsPreviewOpen(true)}
                            className="px-6 py-3 rounded-2xl font-bold bg-secondary/10 text-secondary hover:bg-secondary/20 transition-all flex items-center gap-2 border border-secondary/20 cursor-pointer"
                        >
                            <Eye size={18} /> Preview
                        </button>
                        <button
                            type="button"
                            onClick={handleSubmit((data) => onSave(data, true))}
                            className="px-6 py-3 rounded-2xl font-bold bg-muted hover:bg-background transition-all flex items-center gap-2 bg-white border border-black cursor-pointer focus:ring-2 focus:ring-muted-foreground/20"
                        >
                            <Save size={18} /> Save as Draft
                        </button>
                        <button
                            type="button"
                            onClick={handleSubmit((data) => onSave(data, false))}
                            className="px-8 py-3 rounded-2xl font-bold bg-primary text-primary-foreground hover:brightness-110 transition-all shadow-lg shadow-primary/20 flex items-center gap-2 cursor-pointer focus:ring-2 focus:ring-primary/40"
                        >
                            <Send size={18} /> Send Quotation
                        </button>
                    </div>
                </form>
            </div>

            {/* Version History Sidebar */}
            {isHistoryOpen && (
                <div className="w-80 shrink-0 sticky top-24 h-[calc(100vh-140px)] animate-in slide-in-from-right fade-in">
                    <VersionHistory history={history} />
                </div>
            )}

            <Modal isOpen={isPreviewOpen} onClose={() => setIsPreviewOpen(false)} title="Quotation Preview">
                <QuotationPreview
                    data={{
                        ...formData,
                        customerId: formData.customer,
                        customer: customers.find(c => c._id === formData.customer),
                        logo: logoPreview
                    }}
                    subtotal={subtotal}
                    tax={tax}
                    total={total}
                />
            </Modal>
        </div>
    );
}
