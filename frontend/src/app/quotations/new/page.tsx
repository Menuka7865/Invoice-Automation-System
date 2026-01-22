"use client";
import { useState, useEffect, useRef } from 'react';
import { Plus, Trash2, Send, Save, ArrowLeft, Building2, Calendar, FileText, Loader2, CheckSquare, Square } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useForm, useFieldArray } from 'react-hook-form';
import toast from 'react-hot-toast';
import { formatCurrency } from '@/lib/utils';
import Link from 'next/link';
import Modal from '@/components/ui/Modal';
import QuotationPreview from '@/components/quotations/QuotationPreview';
import VersionHistory, { VersionEntry } from '@/components/quotations/VersionHistory';
import { Eye } from 'lucide-react';
import { useCustomers } from '@/hooks/useCustomers';
import { useQuotations } from '@/hooks/useInvoices';
import { useCompanyProfile } from '@/hooks/useCompanyProfile'; // New hook
import { useServices } from '@/hooks/useServices'; // New hook
import { useProjects } from '@/hooks/useProjects'; // New hook
import AddCompanyModal from '@/components/customers/AddCompanyModal';

export default function NewQuotationPage() {
    const router = useRouter();
    const { customers, fetchCustomers } = useCustomers();
    const { createQuotation } = useQuotations();
    const { profile: companyProfile } = useCompanyProfile();
    const { services, createService, fetchServices } = useServices();
    const { projects, fetchProjectsByCustomer } = useProjects();

    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [isAddCompanyOpen, setIsAddCompanyOpen] = useState(false);
    const [history, setHistory] = useState<VersionEntry[]>([]);
    const [historyOpen, setHistoryOpen] = useState(true); // Default open at bottom

    useEffect(() => {
        fetchCustomers();
        fetchServices();
    }, []);

    const lastStateRef = useRef<any>(null);

    const { register, control, handleSubmit, watch, setValue, getValues } = useForm({
        defaultValues: {
            customer: '',
            date: new Date().toISOString().split('T')[0],
            items: [{ description: '', quantity: 1, price: 0 }],
            taxRate: 0,
            includeTax: true,
            project: '',
            currency: 'USD',
            logo: null, // Kept for schema compatibility but hidden from UI
            version: '1.0'
        }
    });

    // Initialize defaults from Company Profile
    useEffect(() => {
        if (companyProfile) {
            // Only set if not already modified? For new quote, just set it.
            if (companyProfile.currency) setValue('currency', companyProfile.currency);
            if (companyProfile.taxRate !== undefined) setValue('taxRate', companyProfile.taxRate);
        }
    }, [companyProfile, setValue]);

    // Fetch projects when customer changes
    const selectedCustomer = watch('customer');
    useEffect(() => {
        if (selectedCustomer) {
            fetchProjectsByCustomer(selectedCustomer);
            setValue('project', ''); // Reset project when customer changes
        }
    }, [selectedCustomer, setValue]);

    const { fields, append, remove } = useFieldArray({
        control,
        name: "items"
    });

    const formData = watch();
    const items = formData.items;
    const currency = formData.currency;
    const includeTax = formData.includeTax;

    // Calculate Totals
    const subtotal = items.reduce((acc: number, item: any) => acc + (Number(item.quantity) * Number(item.price) || 0), 0);
    const taxRate = includeTax ? Number(formData.taxRate) : 0;
    const tax = subtotal * (taxRate / 100);
    const total = subtotal + tax;

    // Change Detection Logic (Simplified for brevity but kept functional)
    useEffect(() => {
        const timer = setTimeout(() => {
            if (!lastStateRef.current) {
                lastStateRef.current = formData;
                return;
            }
            let changeReason = "";
            if (formData.customer !== lastStateRef.current.customer) changeReason = "Updated Customer";
            else if (formData.items.length !== lastStateRef.current.items.length) changeReason = "Modified Line Items";
            else if (formData.currency !== lastStateRef.current.currency) changeReason = "Changed Currency";
            else {
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
        }, 1500);
        return () => clearTimeout(timer);
    }, [formData]);


    const onSave = async (data: any, isDraft = false) => {
        try {
            // Check for new items and save them
            for (const item of data.items) {
                if (item.description && !services.some((s: any) => s.name.toLowerCase() === item.description.toLowerCase())) {
                    // Create new service implicitly
                    // toast.loading(`Saving new item: ${item.description}`);
                    await createService({
                        name: item.description,
                        price: Number(item.price),
                        description: 'Auto-saved from Quotation',
                        status: 'active'
                    });
                }
            }
            // Refresh services after potential adds
            fetchServices();

            const finalData = {
                ...data,
                taxRate: includeTax ? data.taxRate : 0, // Ensure strictly 0 if unchecked
                history,
                status: isDraft ? 'Draft' : 'Sent',
                total
            };
            await createQuotation(finalData);
            router.push('/quotations');
        } catch (error) {
            console.error(error);
            toast.error("Failed to save quotation");
        }
    };

    // Customer success callback
    const handleCompanyCreated = (newId: string) => {
        fetchCustomers();
        setValue('customer', newId);
        toast.success("Company Added & Selected");
    };

    return (
        <div className="max-w-7xl mx-auto space-y-8 pb-12 px-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/quotations" className="p-2 hover:bg-muted rounded-full transition-colors focus:ring-2 focus:ring-primary/20">
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
            </div>

            <form className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Customer & Info */}
                    <div className="bg-card/50 backdrop-blur-sm p-8 rounded-3xl border border-border/50 shadow-sm space-y-6">
                        <h3 className="font-bold flex items-center gap-2 mb-4">
                            <Building2 size={18} className="text-primary" /> Company Information
                        </h3>
                        <div className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-sm font-medium">Select Company</label>
                                <div className="flex gap-2">
                                    <select
                                        {...register('customer', { required: true })}
                                        className="w-full bg-muted/50 border border-transparent rounded-xl p-3 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/20 transition-all font-sans"
                                    >
                                        <option value="">Select a company...</option>
                                        {customers.map((c: any) => (
                                            <option key={c._id} value={c._id}>{c.name}</option>
                                        ))}
                                    </select>
                                    <button
                                        type="button"
                                        onClick={() => setIsAddCompanyOpen(true)}
                                        className="p-3 bg-primary/10 text-primary hover:bg-primary/20 rounded-xl transition-colors"
                                        title="Add New Company"
                                    >
                                        <Plus size={20} />
                                    </button>
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-medium">Select Project (Optional)</label>
                                <select
                                    {...register('project')}
                                    disabled={!selectedCustomer}
                                    className="w-full bg-muted/50 border border-transparent rounded-xl p-3 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/20 transition-all font-sans disabled:opacity-50"
                                >
                                    <option value="">Select a project...</option>
                                    {projects.map((p: any) => (
                                        <option key={p._id} value={p._id}>{p.name}</option>
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
                                        className="w-full bg-muted/50 border border-transparent rounded-xl py-3 pl-10 pr-4 outline-none focus:ring-2 focus:ring-primary/20 transition-all font-sans"
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
                                    <select
                                        {...register('currency')}
                                        className="w-full bg-muted/50 border border-transparent rounded-xl p-3 outline-none focus:ring-2 focus:ring-primary/20 transition-all font-sans"
                                    >
                                        <option value="USD">USD ($)</option>
                                        <option value="EUR">EUR (€)</option>
                                        <option value="GBP">GBP (£)</option>
                                        <option value="LKR">LKR (Rs)</option>
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <div className="flex justify-between items-center mb-1">
                                        <label className="text-sm font-medium">Tax</label>
                                        <button
                                            type="button"
                                            onClick={() => setValue('includeTax', !includeTax)}
                                            className="text-xs flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors"
                                        >
                                            {includeTax ? <CheckSquare size={14} className="text-primary" /> : <Square size={14} />}
                                            Apply Tax
                                        </button>
                                    </div>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            readOnly
                                            {...register('taxRate')}
                                            className={`w-full bg-muted/30 border border-transparent rounded-xl p-3 outline-none transition-all font-sans ${!includeTax ? 'opacity-50' : ''}`}
                                            title="Configure in Settings"
                                        />
                                        <span className="absolute right-4 top-3 text-muted-foreground font-bold">%</span>
                                    </div>
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
                <div className="bg-card/50 backdrop-blur-sm p-8 rounded-3xl border border-border/50 shadow-sm relative z-0">
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
                            <div key={field.id} className="grid grid-cols-12 gap-4 items-start animate-in fade-in slide-in-from-top-1 relative">
                                <div className="col-span-6 relative group">
                                    <input
                                        list={`suggestions-${index}`}
                                        {...register(`items.${index}.description` as const)}
                                        placeholder="Item description..."
                                        className="w-full bg-muted/50 border border-transparent rounded-xl p-3 outline-none focus:ring-2 focus:ring-primary/20 transition-all font-sans"
                                        autoComplete="off"
                                        onChange={(e) => {
                                            // Standard hook form change
                                            register(`items.${index}.description` as const).onChange(e);
                                            // Check if matches existing service to auto-fill price
                                            const match = services.find((s: any) => s.name.toLowerCase() === e.target.value.toLowerCase());
                                            if (match) {
                                                setValue(`items.${index}.price`, match.price);
                                            }
                                        }}
                                    />
                                    {/* Datalist for simple suggestions */}
                                    <datalist id={`suggestions-${index}`}>
                                        {services.map((s: any) => (
                                            <option key={s._id} value={s.name}>{formatCurrency(s.price, currency)}</option>
                                        ))}
                                    </datalist>
                                </div>
                                <div className="col-span-2">
                                    <input
                                        type="number"
                                        min="1"
                                        {...register(`items.${index}.quantity` as const)}
                                        className="w-full bg-muted/50 border border-transparent rounded-xl p-3 outline-none focus:ring-2 focus:ring-primary/20 text-center transition-all font-sans"
                                    />
                                </div>
                                <div className="col-span-3">
                                    <input
                                        type="number"
                                        step="0.01"
                                        {...register(`items.${index}.price` as const)}
                                        className="w-full bg-muted/50 border border-transparent rounded-xl p-3 outline-none focus:ring-2 focus:ring-primary/20 transition-all text-right font-sans"
                                    />
                                </div>
                                <div className="col-span-1 flex justify-center pt-2">
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
                                <span className="font-bold text-foreground">{formatCurrency(subtotal, currency)}</span>
                            </div>
                            <div className={`flex justify-between items-center ${!includeTax ? 'text-muted-foreground/50 line-through' : 'text-muted-foreground'}`}>
                                <span>Tax ({formData.taxRate}%)</span>
                                <span className="font-bold text-foreground">{formatCurrency(tax, currency)}</span>
                            </div>
                            <div className="flex justify-between text-xl border-t border-border/50 pt-4">
                                <span className="font-bold text-foreground">Total Amount</span>
                                <span className="font-black text-primary">{formatCurrency(total, currency)}</span>
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

            <AddCompanyModal
                isOpen={isAddCompanyOpen}
                onClose={() => setIsAddCompanyOpen(false)}
                onSuccess={handleCompanyCreated}
            />

            <Modal isOpen={isPreviewOpen} onClose={() => setIsPreviewOpen(false)} title="Quotation Preview">
                <QuotationPreview
                    data={{
                        ...formData,
                        customerId: formData.customer,
                        customer: customers.find((c: any) => c._id === formData.customer),
                    }}
                    company={companyProfile}
                    subtotal={subtotal}
                    tax={tax}
                    total={total}
                />
            </Modal>

            {/* Real-time History Log (Bottom) */}
            <div className="mt-12 border-t pt-8">
                <button
                    onClick={() => setHistoryOpen(!historyOpen)}
                    className="flex items-center gap-2 font-bold mb-4 hover:text-primary transition-colors"
                >
                    History / Audit Log <span className="text-xs font-normal text-muted-foreground">({history.length} entries)</span>
                </button>

                {historyOpen && (
                    <div className="bg-muted/30 rounded-2xl p-6 max-h-[300px] overflow-y-auto space-y-3 custom-scrollbar">
                        {history.length === 0 && <p className="text-sm text-muted-foreground italic">No changes recorded yet.</p>}
                        {history.map((entry) => (
                            <div key={entry.id} className="flex items-start gap-3 text-sm pb-3 border-b border-border/50 last:border-0 last:pb-0">
                                <div className="w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0" />
                                <div>
                                    <p className="font-medium">{entry.action}</p>
                                    <p className="text-xs text-muted-foreground">{new Date(entry.timestamp).toLocaleString()} by {entry.userName}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
