"use client";

import { useState, useEffect } from 'react';
import { servicesAPI } from '@/lib/api';
import toast from 'react-hot-toast';

export function useServices() {
    const [services, setServices] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchServices = async () => {
        setLoading(true);
        try {
            const { data } = await servicesAPI.list();
            setServices(data);
        } catch (error) {
            toast.error('Failed to load services');
        } finally {
            setLoading(false);
        }
    };

    const createService = async (serviceData: any) => {
        try {
            const { data } = await servicesAPI.create(serviceData);
            setServices((prev) => [...prev, data]);
            toast.success('Service added');
            return data;
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to create service');
        }
    };

    const updateService = async (id: string, serviceData: any) => {
        try {
            const { data } = await servicesAPI.update(id, serviceData);
            setServices((prev) => prev.map((s: any) => s._id === id ? data : s));
            toast.success('Service updated');
            return data;
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to update service');
        }
    };

    const deleteService = async (id: string) => {
        try {
            await servicesAPI.delete(id);
            setServices((prev) => prev.filter((s: any) => s._id !== id));
            toast.success('Service deleted');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to delete service');
        }
    };

    useEffect(() => {
        fetchServices();
    }, []);

    return { services, loading, fetchServices, createService, updateService, deleteService };
}
