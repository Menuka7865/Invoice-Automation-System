"use client";

import { useState, useEffect } from 'react';
import { companyAPI } from '@/lib/api';
import toast from 'react-hot-toast';

export function useCompanyProfile() {
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const fetchProfile = async () => {
        setLoading(true);
        try {
            const { data } = await companyAPI.get();
            setProfile(data);
        } catch (error) {
            toast.error('Failed to load company profile');
        } finally {
            setLoading(false);
        }
    };

    const updateProfile = async (profileData: any) => {
        try {
            const { data } = await companyAPI.update(profileData);
            setProfile(data);
            toast.success('Company profile updated');
            return data;
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to update company profile');
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    return { profile, loading, fetchProfile, updateProfile };
}
