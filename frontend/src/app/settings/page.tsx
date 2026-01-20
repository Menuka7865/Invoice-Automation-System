"use client";

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Save, Building2, Mail, Phone, Globe, MapPin, DollarSign, Percent, FileText } from 'lucide-react';
import { useCompanyProfile } from '@/hooks/useCompanyProfile';
import { div } from 'framer-motion/client';

export default function SettingsPage() {
    const { profile, loading, updateProfile } = useCompanyProfile();
    const { register, handleSubmit, setValue, reset, watch } = useForm({
        defaultValues: {
            name: '',
            email: '',
            phone: '',
            website: '',
            address: '',
            taxRate: 0,
            currency: 'USD',
            pdfHeaderImage: null as string | null,
            logo: null as string | null
        }
    });

    const pdfHeaderImage = watch('pdfHeaderImage');

    useEffect(() => {
        if (profile) {
            reset({
                name: profile.name || '',
                email: profile.email || '',
                phone: profile.phone || '',
                website: profile.website || '',
                address: profile.address || '',
                taxRate: profile.taxRate || 0,
                currency: profile.currency || 'USD',
                pdfHeaderImage: profile.pdfHeaderImage || null,
                logo: profile.logo || null
            });
        }
    }, [profile, reset]);



    const onSubmit = async (data: any) => {
        await updateProfile(data);
    };

    if (loading) {
        return <div className="p-8">Loading settings...</div>;
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-12">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
                <p className="text-muted-foreground">Manage your company profile and default configuration.</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                {/* Company Profile Section */}
                <div className="bg-card p-8 rounded-3xl border shadow-sm space-y-6">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <Building2 className="text-primary" size={24} /> Company Profile
                    </h2>

                    {/* Logo Upload */}
                    <div className="flex flex-col items-center justify-center sm:items-start space-y-3">
                        <label className="text-sm font-medium">Company Logo</label>
                        <div className="relative group w-24 h-24 rounded-full border-2 border-dashed border-muted-foreground/30 flex items-center justify-center overflow-hidden cursor-pointer hover:border-primary transition-colors">
                            <input
                                type="file"
                                accept="image/*"
                                className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                onChange={(e) => {
                                    if (e.target.files && e.target.files[0]) {
                                        const reader = new FileReader();
                                        reader.onload = (event) => {
                                            setValue('logo', event.target?.result as string);
                                        };
                                        reader.readAsDataURL(e.target.files[0]);
                                    }
                                }}
                            />
                            {watch('logo') ? (
                                <img src={watch('logo') as string} alt="Company Logo" className="w-full h-full object-cover" />
                            ) : (
                                <div className="text-center p-2">
                                    <Building2 className="w-8 h-8 text-muted-foreground/50 mx-auto" />
                                    <span className="text-[10px] text-muted-foreground block mt-1">Upload</span>
                                </div>
                            )}
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="text-xs text-white font-medium">Change</span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Company Name</label>
                            <div className="relative">
                                <Building2 className="absolute left-3 top-3 text-muted-foreground" size={18} />
                                <input
                                    {...register('name')}
                                    className="w-full bg-muted/50 border border-transparent rounded-xl py-3 pl-10 pr-4 outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                    placeholder="Your Company Name"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 text-muted-foreground" size={18} />
                                <input
                                    {...register('email')}
                                    className="w-full bg-muted/50 border border-transparent rounded-xl py-3 pl-10 pr-4 outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                    placeholder="billing@company.com"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Phone Number</label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-3 text-muted-foreground" size={18} />
                                <input
                                    {...register('phone')}
                                    className="w-full bg-muted/50 border border-transparent rounded-xl py-3 pl-10 pr-4 outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                    placeholder="+1 (555) 000-0000"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Website</label>
                            <div className="relative">
                                <Globe className="absolute left-3 top-3 text-muted-foreground" size={18} />
                                <input
                                    {...register('website')}
                                    className="w-full bg-muted/50 border border-transparent rounded-xl py-3 pl-10 pr-4 outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                    placeholder="www.company.com"
                                />
                            </div>
                        </div>
                        <div className="col-span-1 md:col-span-2 space-y-2">
                            <label className="text-sm font-medium">Address</label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-3 text-muted-foreground" size={18} />
                                <input
                                    {...register('address')}
                                    className="w-full bg-muted/50 border border-transparent rounded-xl py-3 pl-10 pr-4 outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                    placeholder="123 Business St, City, Country"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Financial Settings Section */}
                <div className="bg-card p-8 rounded-3xl border shadow-sm space-y-6">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <DollarSign className="text-primary" size={24} /> Financial Settings
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Default Currency</label>
                            <select
                                {...register('currency')}
                                className="w-full bg-muted/50 border border-transparent rounded-xl p-3 outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                            >
                                <option value="USD">USD ($)</option>
                                <option value="EUR">EUR (€)</option>
                                <option value="GBP">GBP (£)</option>
                                <option value="LKR">LKR (Rs)</option>
                            </select>
                            <p className="text-xs text-muted-foreground">This will be the default currency for new quotations.</p>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Default Tax Rate (%)</label>
                            <div className="relative">
                                <Percent className="absolute left-3 top-3 text-muted-foreground" size={18} />
                                <input
                                    type="number"
                                    step="0.01"
                                    {...register('taxRate')}
                                    className="w-full bg-muted/50 border border-transparent rounded-xl py-3 pl-10 pr-4 outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                    placeholder="0"
                                />
                            </div>
                            <p className="text-xs text-muted-foreground">This tax rate will be automatically applied to new quotations.</p>
                        </div>
                    </div>
                </div>

                {/* PDF Customization Section */}
                <div className="bg-card p-8 rounded-3xl border shadow-sm space-y-6">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <FileText className="text-primary" size={24} /> PDF Customization
                    </h2>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">PDF Header Image</label>
                        <div className="relative w-full h-32 border-2 border-dashed border-muted-foreground/50 rounded-xl flex items-center justify-center overflow-hidden cursor-pointer">
                            <input
                                type="file"
                                accept="image/*"
                                className="absolute inset-0 opacity-0 cursor-pointer"
                                onChange={(e) => {
                                    if (e.target.files && e.target.files[0]) {
                                        const reader = new FileReader();
                                        reader.onload = (event) => {
                                            setValue('pdfHeaderImage', event.target?.result as string);
                                        };
                                        reader.readAsDataURL(e.target.files[0]);
                                    }
                                }}
                            />
                            {pdfHeaderImage ? (
                                <img src={pdfHeaderImage as string} alt="Header" className="w-full h-full object-cover" />
                            ) : (
                                <div className="flex flex-col items-center p-4 text-center">
                                    <FileText className="text-muted-foreground mb-2" />
                                    <span className="text-xs text-muted-foreground">Click to upload header image</span>
                                </div>
                            )}
                        </div>
                        <p className="text-xs text-muted-foreground">Upload an image to appear in the header of your PDF documents.</p>
                    </div>
                </div>

                <div className="flex justify-end">
                    <button
                        type="submit"
                        className="bg-primary text-black px-8 py-3 rounded-2xl font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-all flex items-center gap-2"
                    >
                        <Save size={20} /> Save Changes
                    </button>
                </div>
            </form>
        </div >
    );
}
