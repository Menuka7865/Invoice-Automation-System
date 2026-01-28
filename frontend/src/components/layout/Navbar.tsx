"use client";

import { Bell, Search, User, Moon, Sun, Menu } from 'lucide-react';
import { useUIStore, useAuthStore } from '@/lib/store';

export default function Navbar() {
    const { isDarkMode, toggleDarkMode, toggleSidebar } = useUIStore();
    const user = useAuthStore((state) => state.user);

    return (
        <header className="h-16 border-b bg-card/80 backdrop-blur-md px-4 md:px-8 flex items-center justify-between sticky top-0 z-40">
            <div className="flex items-center gap-2 md:gap-4">
                <button
                    onClick={toggleSidebar}
                    className="p-2 hover:bg-muted rounded-xl lg:hidden text-muted-foreground"
                >
                    <Menu size={20} />
                </button>

                <div className="lg:hidden">
                    <span className="text-lg font-bold text-black tracking-tight">Fishifox</span>
                </div>

                <div className="hidden md:flex items-center gap-4 bg-muted/50 px-4 py-2 rounded-xl w-64 lg:w-96 border border-border/40">
                    <Search size={18} className="text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search..."
                        className="bg-transparent border-none py-1.5 px-2 outline-none text-sm w-full placeholder:text-muted-foreground/50"
                    />
                </div>
            </div>

            <div className="flex items-center gap-3 md:gap-6">
                <button
                    onClick={toggleDarkMode}
                    className="p-2 hover:bg-muted rounded-full transition-colors text-muted-foreground hover:text-primary"
                >
                    {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                </button>

                <div className="flex items-center gap-3 pl-4 md:pl-6 border-l">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-semibold">{user?.name || 'Admin User'}</p>
                        <p className="text-xs text-muted-foreground capitalize">{user?.roles?.[0] || 'Administrator'}</p>
                    </div>
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gray-50 flex items-center justify-center text-primary font-bold border border-primary/20">
                        {user?.name?.[0] || 'A'}
                    </div>
                </div>
            </div>
        </header>
    );
}
