"use client";

import { useAuthStore } from '@/lib/store';
import { authAPI } from '@/lib/api';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export function useAuth() {
    const router = useRouter();
    const { setAuth, logout: clearAuth, user, token } = useAuthStore();

    const login = async (credentials: any) => {
        try {
            const { data } = await authAPI.login(credentials);
            setAuth(data.user, data.access_token);
            toast.success('Welcome back!');
            router.push('/dashboard');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Login failed');
        }
    };

    const signup = async (userData: any) => {
        try {
            await authAPI.signup(userData);
            toast.success('Account created! Please log in.');
            router.push('/login');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Signup failed');
        }
    };

    const logout = () => {
        clearAuth();
        router.push('/login');
        toast.success('Logged out successfully');
    };

    return { user, token, login, signup, logout };
}
