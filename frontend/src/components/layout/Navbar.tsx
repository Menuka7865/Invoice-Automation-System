"use client";

import { Bell, Search, User, Moon, Sun } from 'lucide-react';
import { useUIStore, useAuthStore } from '@/lib/store';

export default function Navbar() {
    const { isDarkMode, toggleDarkMode } = useUIStore();
    const user = useAuthStore((state) => state.user);

    return (
        <header className="h-16 border-b bg-card/80 backdrop-blur-md px-8 flex items-center justify-between sticky top-0 z-40">
            <div className="flex items-center gap-4 bg-muted/50 px-4 py-2 rounded-xl w-96 border border-border/40">
                <Search size={18} className="text-muted-foreground" />
                <input
                    type="text"
                    placeholder="Search for invoices, customers..."
                    className="bg-transparent border-none py-1.5 px-2 outline-none text-sm w-full placeholder:text-muted-foreground/50"
                />
            </div>

            <div className="flex items-center gap-6">
                <button
                    onClick={toggleDarkMode}
                    className="p-2 hover:bg-muted rounded-full transition-colors text-muted-foreground hover:text-primary"
                >
                    {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                </button>

                <button className="p-2 hover:bg-muted rounded-full transition-colors relative text-muted-foreground hover:text-primary">
                    <Bell size={20} />
                    <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 bg-primary text-[10px] font-bold text-primary-foreground rounded-full flex items-center justify-center border-2 border-background">
                        10
                    </span>
                </button>

                <div className="flex items-center gap-3 pl-6 border-l">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-semibold">{user?.name || 'Admin User'}</p>
                        <p className="text-xs text-muted-foreground capitalize">{user?.roles?.[0] || 'Administrator'}</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-primary font-bold border border-primary/20">
                        {user?.name?.[0] || 'A'}
                    </div>
                </div>
            </div>
        </header>
    );
}
