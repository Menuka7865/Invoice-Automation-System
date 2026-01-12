"use client";

import { Save, Building, Mail, Phone, MapPin, Globe, CreditCard, Shield } from 'lucide-react';
import toast from 'react-hot-toast';

export default function SettingsPage() {
    const handleSave = () => {
        toast.success('Settings saved successfully!');
    };

    return (
        <div className="max-w-4xl space-y-8">
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
                                <button className="bg-primary text-black px-4 py-2 rounded-xl text-sm font-bold">Upload Logo</button>
                               
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-sm font-medium">Business Name</label>
                                <input type="text" className="w-full bg-muted border-none rounded-xl border text-gray-500  p-3 outline-none focus:ring-2 focus:ring-primary/20" defaultValue="My Agency Inc." />
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-medium">Business Email</label>
                                <input type="email" className="w-full bg-muted border-none rounded-xl p-3 border text-gray-500 outline-none focus:ring-2 focus:ring-primary/20" defaultValue="billing@myagency.com" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-medium">Phone Number</label>
                                <input type="text" className="w-full bg-muted border-none rounded-xl  border text-gray-500 p-3 outline-none focus:ring-2 focus:ring-primary/20" defaultValue="+1 (555) 000-0000" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-medium">Website</label>
                                <input type="text" className="w-full bg-muted border-none rounded-xl border text-gray-500 p-3 outline-none focus:ring-2 focus:ring-primary/20" defaultValue="www.myagency.com" />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-medium">Global Address</label>
                            <textarea className="w-full bg-muted border-none rounded-xl border text-gray-500 p-3 outline-none focus:ring-2 focus:ring-primary/20 min-h-[100px]" defaultValue='123 Innovation Drive, Silicon Valley, CA 94025'></textarea>
                        </div>
                    </div>
                </div>
            </div>

            <div className="pt-8 border-t flex justify-end gap-3">
                <button className="px-8 py-3 rounded-2xl text-white font-bold bg-black hover:bg-muted/80 transition-all">Discard Changes</button>
                <button onClick={handleSave} className="px-8 py-3 rounded-2xl font-bold bg-primary text-black hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 flex items-center gap-2">
                    <Save size={18} /> Save Settings
                </button>
            </div>
        </div>
    );
}
