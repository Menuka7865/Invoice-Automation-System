"use client";

import { useEffect } from 'react';
import { Save, Building, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useCompanyProfile } from '@/hooks/useCompanyProfile';
import { useForm } from 'react-hook-form';

export default function SettingsPage() {
    const { profile, loading, updateProfile } = useCompanyProfile();
    const { register, handleSubmit, reset } = useForm();

    useEffect(() => {
        if (profile) {
            reset(profile);
        }
    }, [profile, reset]);

    const onSubmit = async (data: any) => {
        await updateProfile(data);
    };

    if (loading) {
        return (
            <div className="h-64 flex flex-col items-center justify-center text-muted-foreground">
                <Loader2 className="animate-spin mb-4" size={40} />
                <p className="font-bold">Loading settings...</p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="max-w-4xl space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">System Settings</h1>
                <p className="text-muted-foreground">Configure your company profile and system preferences.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-1">
                    <h3 className="font-bold text-lg">Company Profile</h3>
                    <p className="text-sm text-muted-foreground mt-1">This information will appear on your quotations and invoices.</p>
                </div>

                <div className="md:col-span-2 space-y-6">
                    <div className="bg-card p-8 rounded-3xl border shadow-sm space-y-6">
                        <div className="flex items-center gap-6 pb-6 border-b">
                            <div className="w-20 h-20 bg-muted rounded-2xl flex items-center justify-center border-2 border-dashed border-primary/20 hover:bg-primary/5 transition-colors cursor-pointer group">
                                <Building className="text-muted-foreground group-hover:text-primary transition-colors" size={32} />
                            </div>
                            <div>
                                <button type="button" className="bg-primary text-black px-4 py-2 rounded-xl text-sm font-bold">Upload Logo</button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-sm font-medium">Business Name</label>
                                <input {...register('name')} type="text" className="w-full bg-muted border-none rounded-xl p-3 outline-none focus:ring-2 focus:ring-primary/20" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-medium">Business Email</label>
                                <input {...register('email')} type="email" className="w-full bg-muted border-none rounded-xl p-3 outline-none focus:ring-2 focus:ring-primary/20" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-medium">Phone Number</label>
                                <input {...register('phone')} type="text" className="w-full bg-muted border-none rounded-xl p-3 outline-none focus:ring-2 focus:ring-primary/20" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-medium">Website</label>
                                <input {...register('website')} type="text" className="w-full bg-muted border-none rounded-xl p-3 outline-none focus:ring-2 focus:ring-primary/20" />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-medium">Global Address</label>
                            <textarea {...register('address')} className="w-full bg-muted border-none rounded-xl p-3 outline-none focus:ring-2 focus:ring-primary/20 min-h-[100px]"></textarea>
                        </div>
                    </div>
                </div>
            </div>

            <div className="pt-8 border-t flex justify-end gap-3">
                <button type="button" onClick={() => reset(profile)} className="px-8 py-3 rounded-2xl text-white font-bold bg-black hover:bg-muted/80 transition-all">Discard Changes</button>
                <button type="submit" className="px-8 py-3 rounded-2xl font-bold bg-primary text-black hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 flex items-center gap-2">
                    <Save size={18} /> Save Settings
                </button>
            </div>
        </form>
    );
}
