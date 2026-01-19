'use client'
import { Search, Receipt, Download, RefreshCw, Filter, CreditCard, Clock, CheckCircle, AlertCircle, Loader2, Send, Trash2 } from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';
import { useInvoices } from '@/hooks/useInvoices';
import { useState } from 'react';



import CreateInvoiceModal from '@/components/CreateInvoiceModal';

export default function InvoicesPage() {
    const [activeTab, setActiveTab] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { invoices, loading, fetchInvoices, deleteInvoice, updateInvoice, downloadPdf, sendInvoice } = useInvoices();

    const filteredInvoices = invoices.filter((inv: any) => {
        const matchesSearch =
            inv._id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (typeof inv.customer === 'object'
                ? inv.customer?.name?.toLowerCase().includes(searchTerm.toLowerCase())
                : inv.customer?.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesTab = activeTab === 'All' || inv.status === activeTab;

        return matchesSearch && matchesTab;
    });

    const paidTotal = invoices.filter((i: any) => i.status === 'Paid').reduce((acc: number, i: any) => acc + (i.total || 0), 0);
    const pendingTotal = invoices.filter((i: any) => i.status === 'Sent').reduce((acc: number, i: any) => acc + (i.total || 0), 0);
    const overdueTotal = invoices.filter((i: any) => i.status === 'Overdue').reduce((acc: number, i: any) => acc + (i.total || 0), 0);

    const getStatusDetails = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'paid': return { color: 'bg-emerald-500/10 text-emerald-500', icon: <CheckCircle size={14} /> };
            case 'overdue': return { color: 'bg-destructive/10 text-destructive', icon: <AlertCircle size={14} /> };
            case 'sent': return { color: 'bg-blue-500/10 text-blue-500', icon: <CreditCard size={14} /> };
            case 'draft': return { color: 'bg-slate-500/10 text-slate-500', icon: <Clock size={14} /> };
            default: return { color: 'bg-slate-500/10 text-slate-500', icon: null };
        }
    };

    const handleStatusChange = async (id: string, newStatus: string) => {
        await updateInvoice(id, { status: newStatus });
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Invoice Management</h1>
                    <p className="text-muted-foreground">Track payments, send reminders, and manage your billing.</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-primary text-gray-700 px-6 py-2.5 rounded-xl font-bold hover:opacity-90 transition-all flex items-center gap-2"
                    >
                        <Receipt size={18} /> Create Invoice
                    </button>

                </div>


            </div>

            <CreateInvoiceModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-emerald-500/10 p-6 rounded-3xl border border-emerald-500/20">
                    <p className="text-emerald-700 text-sm font-bold uppercase tracking-wider mb-1">Total Paid</p>
                    <h3 className="text-2xl font-black text-emerald-500">{formatCurrency(paidTotal)}</h3>
                </div>
                <div className="bg-amber-500/10 p-6 rounded-3xl border border-amber-500/20">
                    <p className="text-amber-700 text-sm font-bold uppercase tracking-wider mb-1">Pending Amount</p>
                    <h3 className="text-2xl font-black text-amber-500">{formatCurrency(pendingTotal)}</h3>
                </div>
                <div className="bg-destructive/10 p-6 rounded-3xl border border-destructive/20">
                    <p className="text-destructive/70 text-sm font-bold uppercase tracking-wider mb-1">Overdue Total</p>
                    <h3 className="text-2xl font-black text-destructive">{formatCurrency(overdueTotal)}</h3>
                </div>
            </div>

            <div className="bg-card rounded-3xl border shadow-sm overflow-hidden">
                <div className="p-6 border-b flex flex-col sm:flex-row gap-4 justify-between items-center">
                    <div className="relative w-full sm:w-96">
                        <Search className="absolute left-3 top-2.5 text-muted-foreground" size={18} />
                        <input
                            type="text"
                            placeholder="Search by invoice number or customer..."
                            className="w-full bg-muted border-none rounded-xl py-2 pl-10 pr-4 outline-none text-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    {/* Tabs */}
                    <div className="flex gap-2 p-1 bg-muted/50 rounded-2xl w-fit border border-border/40">
                        {['All', 'Draft', 'Sent', 'Paid', 'Overdue'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === tab
                                    ? 'bg-card text-primary shadow-sm'
                                    : 'text-muted-foreground hover:text-foreground'
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-muted/30">
                            <tr className="text-muted-foreground text-[11px] uppercase tracking-wider">
                                <th className="px-8 py-4 font-bold">Invoice ID</th>
                                <th className="px-8 py-4 font-bold">Customer</th>
                                <th className="px-8 py-4 font-bold">Due Date</th>
                                <th className="px-8 py-4 font-bold">Total Amount</th>
                                <th className="px-8 py-4 font-bold">Status</th>
                                <th className="px-8 py-4 font-bold text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="px-8 py-20 text-center">
                                        <Loader2 className="animate-spin mx-auto mb-4 text-primary" size={32} />
                                        <p className="text-muted-foreground font-bold">Loading invoices...</p>
                                    </td>
                                </tr>
                            ) : filteredInvoices.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-8 py-20 text-center text-muted-foreground">
                                        No invoices found.
                                    </td>
                                </tr>
                            ) : filteredInvoices.map((inv: any) => {
                                const { color, icon } = getStatusDetails(inv.status);
                                return (
                                    <tr key={inv._id} className="hover:bg-muted/20 transition-colors group">
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-primary/5 rounded-xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-gray-500 transition-all">
                                                    <Receipt size={18} />
                                                </div>
                                                <span className="font-bold text-sm">INV-{inv._id?.slice(-6).toUpperCase()}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5 text-sm font-medium">
                                            {typeof inv.customer === 'object' ? (inv.customer?.name || 'N/A') : (inv.customer || 'N/A')}
                                        </td>
                                        <td className="px-8 py-5 text-sm">
                                            <div className="flex flex-col">
                                                <span className="font-semibold text-xs">{formatDate(inv.dueDate)}</span>
                                                <span className="text-[10px] text-muted-foreground">Created: {formatDate(inv.createdAt)}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5 text-sm font-extrabold">{formatCurrency(inv.total)}</td>
                                        <td className="px-8 py-5">
                                            <div className={`flex items-center gap-2 w-fit px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${color}`}>
                                                {icon}
                                                <select
                                                    value={inv.status}
                                                    onChange={(e) => handleStatusChange(inv._id, e.target.value)}
                                                    className="bg-transparent border-none outline-none font-bold cursor-pointer"
                                                >
                                                    <option value="Draft">Draft</option>
                                                    <option value="Sent">Sent</option>
                                                    <option value="Paid">Paid</option>
                                                    <option value="Overdue">Overdue</option>
                                                </select>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="flex justify-center gap-2">
                                                <button
                                                    onClick={() => downloadPdf(inv._id)}
                                                    className="p-2 hover:bg-muted rounded-lg text-muted-foreground transition-colors"
                                                    title="Download PDF"
                                                >
                                                    <Download size={16} />
                                                </button>
                                                <button
                                                    onClick={() => sendInvoice(inv._id)}
                                                    className="p-2 hover:bg-muted rounded-lg text-muted-foreground transition-colors"
                                                    title="Send to Customer"
                                                >
                                                    <Send size={16} />
                                                </button>
                                                <button
                                                    onClick={() => deleteInvoice(inv._id)}
                                                    className="p-2 hover:bg-destructive/10 rounded-lg text-destructive transition-colors"
                                                    title="Delete Invoice"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
