"use client";

import { formatCurrency } from '@/lib/utils';
import { Building2, Calendar, FileText } from 'lucide-react';

interface QuotationPreviewProps {
    data: {
        customerId: string;
        customer?: {
            name: string;
            email: string;
            phone?: string;
            address?: string;
        } | null;
        date: string;
        items: Array<{ description: string; quantity: number; price: number }>;
        taxRate: number;
        logo?: string | null;
        currency?: string;
    };
    company?: {
        name: string;
        address: string;
        email: string;
        phone: string;
        logo?: string;
    } | null;
    subtotal: number;
    tax: number;
    total: number;
}

export default function QuotationPreview({ data, company, subtotal, tax, total }: QuotationPreviewProps) {
    const currency = data.currency || 'USD';
    const logoToUse = data.logo || company?.logo;

    return (
        <div className="bg-white text-slate-900 p-8 rounded-2xl shadow-inner min-h-[600px] flex flex-col font-sans">
            {/* Header / Logo */}
            <div className="flex justify-between items-start mb-12 border-b pb-8 border-slate-100">
                <div className="flex items-center gap-4">
                    {logoToUse ? (
                        <img src={logoToUse} alt="Company Logo" className="w-24 h-24 object-contain" />
                    ) : (
                        <div className="w-16 h-16 bg-slate-100 rounded-xl flex items-center justify-center border border-slate-200">
                            <Building2 className="text-slate-400" size={32} />
                        </div>
                    )}
                    <div>
                        <h2 className="text-2xl font-black uppercase tracking-tighter text-slate-800">Quotation</h2>
                        <p className="text-sm font-medium text-slate-500">REF: QUO-{new Date(data.date).getFullYear() || new Date().getFullYear()}-{Math.floor(100 + Math.random() * 900)}</p>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">Date</p>
                    <p className="text-sm font-bold">{data.date}</p>
                </div>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-2 gap-12 mb-12">
                <div>
                    <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                        <Building2 size={14} /> To Customer
                    </h4>
                    <p className="text-lg font-bold">
                        {data.customer?.name || "Unspecified Customer"}
                    </p>
                    <div className="text-sm text-slate-500 mt-1 space-y-0.5">
                        {data.customer?.email && <p>{data.customer.email}</p>}
                        {data.customer?.phone && <p>{data.customer.phone}</p>}
                        {data.customer?.address && <p>{data.customer.address}</p>}
                    </div>
                </div>
                <div>
                    <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                        <FileText size={14} /> From Company
                    </h4>
                    <p className="text-lg font-bold">{company?.name || "Innovation Drive Co."}</p>
                    <p className="text-sm text-slate-500 mt-1">{company?.address || "123 Innovation Drive, SV, CA"}</p>
                    {company?.email && <p className="text-sm text-slate-500">{company.email}</p>}
                    {company?.phone && <p className="text-sm text-slate-500">{company.phone}</p>}
                </div>
            </div>

            {/* Items Table */}
            <div className="grow">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b-2 border-slate-900">
                            <th className="py-4 text-xs font-black uppercase tracking-widest text-slate-400">Description</th>
                            <th className="py-4 text-xs font-black uppercase tracking-widest text-slate-400 text-center">Qty</th>
                            <th className="py-4 text-xs font-black uppercase tracking-widest text-slate-400 text-right">Unit Price</th>
                            <th className="py-4 text-xs font-black uppercase tracking-widest text-slate-400 text-right">Amount</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm">
                        {data.items.map((item, idx) => (
                            <tr key={idx} className="border-b border-slate-100">
                                <td className="py-4 font-bold">{item.description || "Unspecified Item"}</td>
                                <td className="py-4 text-center">{item.quantity}</td>
                                <td className="py-4 text-right">{formatCurrency(item.price, currency)}</td>
                                <td className="py-4 text-right font-bold">{formatCurrency(item.quantity * item.price, currency)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Calculations */}
            <div className="mt-12 pt-8 border-t-2 border-slate-100 flex justify-end">
                <div className="w-64 space-y-3">
                    <div className="flex justify-between text-sm">
                        <span className="font-medium text-slate-500 uppercase tracking-widest">Subtotal</span>
                        <span className="font-bold">{formatCurrency(subtotal, currency)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="font-medium text-slate-500 uppercase tracking-widest">Tax ({data.taxRate}%)</span>
                        <span className="font-bold">{formatCurrency(tax, currency)}</span>
                    </div>
                    <div className="flex justify-between text-xl border-t border-slate-900 pt-4">
                        <span className="font-black uppercase tracking-tighter">Total</span>
                        <span className="font-black text-slate-900">{formatCurrency(total, currency)}</span>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="mt-12 text-[10px] text-slate-400 font-medium uppercase tracking-[0.2em] text-center italic">
                Thank you for choosing {company?.name || "Innovation Drive Co."}
            </div>
        </div>
    );
}
