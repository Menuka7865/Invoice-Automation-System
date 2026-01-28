'use client'
import { Plus, Search, FileText, Download, Send, CheckCircle, Clock, XCircle, MoreHorizontal, Loader2, Trash2, Edit2 } from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';
import { useQuotations } from '@/hooks/useInvoices';
import Link from 'next/link';
import { useState } from 'react';
import { useCompanyProfile } from '@/hooks/useCompanyProfile';
import DownloadOptionsModal from '@/components/quotations/DownloadOptionsModal';
import SendEmailModal from '@/components/quotations/SendEmailModal';

export default function QuotationsPage() {
    const [activeTab, setActiveTab] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const { quotations, loading, acceptQuotation, deleteQuotation, updateQuotation, downloadPdf, sendQuotation } = useQuotations();
    const { profile: companyProfile } = useCompanyProfile();

    // Modal States
    const [downloadModalOpen, setDownloadModalOpen] = useState(false);
    const [sendModalOpen, setSendModalOpen] = useState(false);
    const [selectedQuotation, setSelectedQuotation] = useState<any>(null);

    const handleDownloadClick = (quote: any) => {
        setSelectedQuotation(quote);
        setDownloadModalOpen(true);
    };

    const handleSendClick = (quote: any) => {
        setSelectedQuotation(quote);
        setSendModalOpen(true);
    };

    const tabs = ['All', 'Draft', 'Sent', 'Accepted', 'Declined'];

    // Filter quotations based on active tab
    const filteredQuotations = quotations.filter((q: any) => {
        const customerName = q.customer?.name || '';
        const statusMatch = activeTab === 'All' || (q.status && q.status.toLowerCase() === activeTab.toLowerCase());
        const searchMatch = !searchTerm ||
            (q._id && q._id.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (customerName.toLowerCase().includes(searchTerm.toLowerCase()));
        return statusMatch && searchMatch;
    });

    const handleStatusChange = async (id: string, newStatus: string) => {
        await updateQuotation(id, { status: newStatus });
    };

    const getStatusColor = (status: string) => {
        const normalizedStatus = status?.toLowerCase() || '';
        if (normalizedStatus.includes('accept')) return 'bg-emerald-500/10 text-emerald-500';
        if (normalizedStatus.includes('sent')) return 'bg-blue-500/10 text-blue-500';
        if (normalizedStatus.includes('draft')) return 'bg-slate-500/10 text-slate-500';
        if (normalizedStatus.includes('declin')) return 'bg-destructive/10 text-destructive';
        return 'bg-slate-500/10 text-slate-500';
    };

    const getStatusIcon = (status: string) => {
        const normalizedStatus = status?.toLowerCase() || '';
        if (normalizedStatus.includes('accept')) return <CheckCircle size={14} />;
        if (normalizedStatus.includes('sent')) return <Send size={14} />;
        if (normalizedStatus.includes('draft')) return <Clock size={14} />;
        if (normalizedStatus.includes('declin')) return <XCircle size={14} />;
        return null;
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Quotations</h1>
                    <p className="text-muted-foreground text-sm">Estimate and propose projects to your customers.</p>
                </div>
                <Link
                    href="/quotations/new"
                    className="w-full sm:w-auto bg-primary text-black px-6 py-2.5 rounded-xl font-semibold shadow-lg shadow-primary/20 hover:scale-105 transition-all flex items-center justify-center gap-2 text-sm md:text-base"
                >
                    <Plus size={20} /> Create Quotation
                </Link>
            </div>

            <div className="bg-card rounded-3xl border shadow-sm overflow-hidden">
                {/* Tabs */}
                <div className="overflow-x-auto scrollbar-hide border-b px-4 md:px-8">
                    <div className="flex items-center gap-4 md:gap-6 whitespace-nowrap min-w-max">
                        {tabs.map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`py-4 md:py-6 text-sm font-semibold transition-all relative ${activeTab === tab ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                                    }`}
                            >
                                {tab}
                                {activeTab === tab && (
                                    <div className="absolute bottom-0 left-0 w-full h-1 bg-primary rounded-t-full shadow-[0_-4px_10px_rgba(139,92,246,0.3)]" />
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Filters */}
                <div className="p-6 border-b flex gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-2.5 text-muted-foreground" size={18} />
                        <input
                            type="text"
                            placeholder="Search quotes by ID or customer..."
                            className="w-full bg-muted border-none rounded-xl py-2 pl-10 pr-4 outline-none text-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                </div>

                {/* Table */}
                <div className="overflow-x-auto -mx-4 md:mx-0">
                    <div className="inline-block min-w-full align-middle md:px-0 px-4">
                        <table className="w-full text-left">
                            <thead className="bg-muted/30">
                                <tr className="text-muted-foreground text-[11px] uppercase tracking-wider">
                                    <th className="px-4 md:px-8 py-4 font-bold min-w-[150px]">Quote Number</th>
                                    <th className="px-4 md:px-8 py-4 font-bold min-w-[150px]">Company</th>
                                    <th className="px-4 md:px-8 py-4 font-bold min-w-[120px]">Created Date</th>
                                    <th className="px-4 md:px-8 py-4 font-bold min-w-[120px]">Total Amount</th>
                                    <th className="px-4 md:px-8 py-4 font-bold min-w-[120px]">Status</th>
                                    <th className="px-4 md:px-8 py-4 font-bold text-center min-w-[200px]">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {loading ? (
                                    <tr>
                                        <td colSpan={6} className="px-8 py-20 text-center">
                                            <Loader2 className="animate-spin mx-auto mb-4 text-primary" size={32} />
                                            <p className="text-muted-foreground font-bold">Loading quotations...</p>
                                        </td>
                                    </tr>
                                ) : filteredQuotations.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-8 py-20 text-center text-muted-foreground">
                                            No quotations found. Create one to get started.
                                        </td>
                                    </tr>
                                ) : filteredQuotations.map((quote: any) => (
                                    <tr key={quote._id} className="hover:bg-muted/20 transition-colors group">
                                        <td className="px-4 md:px-8 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 md:w-10 md:h-10 bg-primary/5 rounded-xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-gray-500 transition-all shrink-0">
                                                    <FileText className="w-4 h-4 md:w-[18px] md:h-[18px]" />
                                                </div>
                                                <span className="font-bold text-sm">QT-{quote._id?.slice(-6).toUpperCase()}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 md:px-8 py-5 text-sm font-medium">
                                            {typeof quote.customer === 'object' ? (quote.customer?.name || 'N/A') : (quote.customer || 'N/A')}
                                        </td>
                                        <td className="px-4 md:px-8 py-5 text-sm text-muted-foreground">{formatDate(quote.createdAt)}</td>
                                        <td className="px-4 md:px-8 py-5 text-sm font-extrabold">{formatCurrency(quote.total, quote.currency || companyProfile?.currency)}</td>
                                        <td className="px-4 md:px-8 py-5">
                                            <div className={`flex items-center gap-2 w-fit px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusColor(quote.status)}`}>
                                                {getStatusIcon(quote.status)}
                                                <select
                                                    value={quote.status}
                                                    onChange={(e) => handleStatusChange(quote._id, e.target.value)}
                                                    className="bg-transparent border-none outline-none font-bold cursor-pointer"
                                                >
                                                    <option value="Draft">Draft</option>
                                                    <option value="Sent">Sent</option>
                                                    <option value="Accepted">Accepted</option>
                                                    <option value="Declined">Declined</option>
                                                </select>
                                            </div>
                                        </td>
                                        <td className="px-4 md:px-8 py-5">
                                            <div className="flex justify-center gap-1 md:gap-2">
                                                {quote.status !== 'Accepted' && (
                                                    <button
                                                        onClick={() => acceptQuotation(quote._id)}
                                                        className="p-2 hover:bg-emerald-500/10 rounded-lg text-emerald-600 transition-colors"
                                                        title="Accept & Generate Invoice"
                                                    >
                                                        <CheckCircle className="w-3.5 h-3.5 md:w-4 md:h-4" />
                                                    </button>
                                                )}
                                                <Link
                                                    href={`/quotations/${quote._id}`}
                                                    className="p-2 hover:bg-muted rounded-lg text-muted-foreground transition-colors"
                                                    title="Edit Quotation"
                                                >
                                                    <Edit2 className="w-3.5 h-3.5 md:w-4 md:h-4" />
                                                </Link>
                                                <button
                                                    onClick={() => handleDownloadClick(quote)}
                                                    className="p-2 hover:bg-muted rounded-lg text-muted-foreground transition-colors"
                                                    title="Download PDF"
                                                >
                                                    <Download className="w-3.5 h-3.5 md:w-4 md:h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleSendClick(quote)}
                                                    className="p-2 hover:bg-muted rounded-lg text-muted-foreground transition-colors"
                                                    title="Send to Customer"
                                                >
                                                    <Send className="w-3.5 h-3.5 md:w-4 md:h-4" />
                                                </button>
                                                <button
                                                    title='btn'
                                                    onClick={() => deleteQuotation(quote._id)}
                                                    className="p-2 hover:bg-destructive/10 rounded-lg text-destructive transition-colors"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5 md:w-4 md:h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <DownloadOptionsModal
                isOpen={downloadModalOpen}
                onClose={() => setDownloadModalOpen(false)}
                onDownload={(options) => downloadPdf(selectedQuotation?._id, options)}
            />

            <SendEmailModal
                isOpen={sendModalOpen}
                onClose={() => setSendModalOpen(false)}
                onSend={(recipients: string[], options: any) => {
                    sendQuotation(selectedQuotation?._id, recipients, options);
                }}
                customer={selectedQuotation?.customer}
            />
        </div>
    );
}
