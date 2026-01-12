"use client";

import { useState, useEffect } from 'react';
import { invoicesAPI, quotationsAPI } from '@/lib/api';
import toast from 'react-hot-toast';
import { id } from 'zod/locales';

interface Invoice {
    _id?: string;
    customer: string;
    quotation?: string;
    status: string;
    items: any[];
    total: number;
    dueDate?: Date;
    paidDate?: Date;
    createdAt?: Date;
    updatedAt?: Date;
}

interface Quotation {
    _id?: string;
    customer: string;
    status: string;
    items: any[];
    total: number;
    createdAt?: Date;
    updatedAt?: Date;
}

export function useInvoices() {
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchInvoices = async () => {
        try {
            const { data } = await invoicesAPI.list();
            setInvoices(data);
        } catch (error) {
            toast.error('Failed to load invoices');
        } finally {
            setLoading(false);
        }
    };

    const createInvoice = async (invoiceData: any) => {
        try {
            const { data } = await invoicesAPI.create(invoiceData);
            setInvoices((prev) => [...prev, data.doc || data]);
            toast.success('Invoice created');
            return data;
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to create invoice');
        }
    };

    const updateInvoice = async (id: string, invoiceData: any) => {
        try {
            const { data } = await invoicesAPI.update(id, invoiceData);
            setInvoices((prev) => prev.map((i: Invoice) => i._id === id ? (data.doc || data) : i));
            toast.success('Invoice updated');
            return data;
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to update invoice');
        }
    };

    const deleteInvoice = async (id: string) => {
        try {
            await invoicesAPI.delete(id);
            setInvoices((prev) => prev.filter((i: Invoice) => i._id !== id));
            toast.success('Invoice deleted');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to delete invoice');
        }
    };

    const downloadPdf = async (_id: string) => {
        try {
            const { data } = await invoicesAPI.downloadPdf(_id);
            const url = window.URL.createObjectURL(new Blob([data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `invoice-${_id}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error: any) {
            toast.error('Failed to download PDF');
        }
    };

    useEffect(() => {
        fetchInvoices();
    }, []);

    return { invoices, loading, fetchInvoices, createInvoice, updateInvoice, deleteInvoice, downloadPdf };
}

export function useQuotations() {
    const [quotations, setQuotations] = useState<Quotation[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchQuotations = async () => {
        try {
            const { data } = await quotationsAPI.list();
            setQuotations(data);
        } catch (error) {
            toast.error('Failed to load quotations');
        } finally {
            setLoading(false);
        }
    };

    const createQuotation = async (quoteData: any) => {
        try {
            const { data } = await quotationsAPI.create(quoteData);
            toast.success('Quotation created');
            setQuotations((prev) => [...prev, data]);
            return data;
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to create quotation');
        }
    };

    const updateQuotation = async (id: string, quoteData: any) => {
        try {
            const { data } = await quotationsAPI.update(id, quoteData);
            setQuotations((prev) => prev.map((q: Quotation) => q._id === id ? data : q));
            toast.success('Quotation updated');
            return data;
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to update quotation');
        }
    };

    const deleteQuotation = async (id: string) => {
        try {
            await quotationsAPI.delete(id);
            setQuotations((prev) => prev.filter((q: Quotation) => q._id !== id));
            toast.success('Quotation deleted');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to delete quotation');
        }
    };

    const acceptQuotation = async (id: string) => {
        try {
            const { data } = await quotationsAPI.update(id, { status: 'Accepted' });
            setQuotations((prev) => prev.map((q: Quotation) => q._id === id ? data : q));
            toast.success('Quotation accepted! Invoice generated.');
            return data;
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to accept quotation');
        }
    };

    const downloadPdf = async (_id: string) => {
        try {
            const { data } = await quotationsAPI.downloadPdf(_id);
            const url = window.URL.createObjectURL(new Blob([data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `quotation-${_id}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error: any) {
            toast.error('Failed to download PDF');
        }
    };

    const sendQuotation = async (id: string) => {
        try {
            await quotationsAPI.sendEmail(id);
            toast.success('Quotation sent to customer email');
            fetchQuotations(); // Refresh to see status change if any
        } catch (error: any) {
            toast.error('Failed to send quotation email');
        }
    };

    useEffect(() => {
        fetchQuotations();
    }, []);

    return { quotations, loading, fetchQuotations, createQuotation, updateQuotation, deleteQuotation, acceptQuotation, downloadPdf, sendQuotation };
}
