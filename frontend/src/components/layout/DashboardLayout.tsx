"use client";

import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { useUIStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const { sidebarOpen, isDarkMode } = useUIStore();
    const pathname = usePathname();

    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [isDarkMode]);

    // Pages that don't use the dashboard layout
    const isPublicPage = pathname === '/' || pathname === '/login' || pathname === '/signup';

    if (isPublicPage) {
        return <div className={cn(isDarkMode && "dark")}>{children}</div>;
    }

    return (
        <div className={cn("min-h-screen", isDarkMode && "dark")}>
            <div className="flex bg-background">
                <Sidebar />
                <main className={cn(
                    "flex-1 transition-all duration-300 min-h-screen",
                    sidebarOpen ? "pl-64" : "pl-20"
                )}>
                    <Navbar />
                    <div className="p-8">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
