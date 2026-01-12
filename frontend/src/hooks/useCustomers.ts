"use client";

import { useState, useEffect } from 'react';
import { customersAPI } from '@/lib/api';
import toast from 'react-hot-toast';

export function useCustomers() {
    const [customers, setCustomers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchCustomers = async (search?: string) => {
        setLoading(true);
        try {
            const { data } = await customersAPI.list(search ? { search } : {});
            setCustomers(data);
        } catch (error) {
            toast.error('Failed to load customers');
        } finally {
            setLoading(false);
        }
    };

    const createCustomer = async (customerData: any) => {
        try {
            const { data } = await customersAPI.create(customerData);
            setCustomers((prev) => [...prev, data]);
            toast.success('Customer added');
            return data;
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to create customer');
        }
    };

    const updateCustomer = async (id: string, customerData: any) => {
        try {
            const { data } = await customersAPI.update(id, customerData);
            setCustomers((prev) => prev.map((c: any) => c._id === id ? data : c));
            toast.success('Customer updated');
            return data;
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to update customer');
        }
    };

    const deleteCustomer = async (id: string) => {
        try {
            await customersAPI.delete(id);
            setCustomers((prev) => prev.filter((c: any) => c._id !== id));
            toast.success('Customer deleted');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to delete customer');
        }
    };

    useEffect(() => {
        fetchCustomers();
    }, []);

    return { customers, loading, fetchCustomers, createCustomer, updateCustomer, deleteCustomer };
}
