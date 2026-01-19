"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Users,
    FileText,
    Receipt,
    Settings,
    LogOut,
    ChevronLeft,
    ChevronRight,
    TrendingUp,
    Mail,
    Briefcase
} from 'lucide-react';
import { useUIStore, useAuthStore } from '@/lib/store';
import { cn } from '@/lib/utils';

const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
    { icon: Briefcase, label: 'Services', href: '/services' },
    { icon: Users, label: 'Customers', href: '/customers' },
    { icon: FileText, label: 'Quotations', href: '/quotations' },
    { icon: Briefcase, label: 'Projects', href: '/projects' },
    { icon: Receipt, label: 'Invoices', href: '/invoices' },
    { icon: TrendingUp, label: 'AI Insights', href: '/insights' },
    // { icon: Mail, label: 'Automation', href: '/automation' },
    { icon: Settings, label: 'Settings', href: '/settings' },
];

export default function Sidebar() {
    const pathname = usePathname();
    const { sidebarOpen, toggleSidebar } = useUIStore();
    const logout = useAuthStore((state) => state.logout);

    return (
        <aside className={cn(
            "fixed left-0 top-0 h-full bg-card border-r transition-all duration-300 z-50",
            sidebarOpen ? "w-64" : "w-20"
        )}>
            <div className="flex items-center justify-between p-4 h-16 border-b">
                {sidebarOpen && (
                    <span className="text-xl font-bold text-black">Fishifox</span>
                )}
                <button
                    onClick={toggleSidebar}
                    className="p-2 hover:bg-muted rounded-md transition-colors"
                >
                    {sidebarOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
                </button>
            </div>

            <nav className="p-4 space-y-2">
                {menuItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-4 p-3 rounded-xl transition-all group",
                                isActive
                                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                                    : "hover:bg-muted text-muted-foreground"
                            )}
                        >
                            <item.icon size={22} className={cn(
                                "min-w-[22px]",
                                isActive ? "text-black" : "group-hover:text-black transition-colors"
                            )} />
                            {sidebarOpen && <span className="font-medium">{item.label}</span>}
                        </Link>
                    );
                })}
            </nav>

            <div className="absolute bottom-4 left-0 w-full p-2">
                <button
                    onClick={logout}
                    className={cn(
                        "flex items-center gap-4 p-3 w-full rounded-xl  hover:bg-destructive/10 text-destructive transition-all group cursor-pointer",
                        !sidebarOpen && "justify-center"
                    )}
                >
                    <LogOut size={22} className="min-w-[22px]" />
                    {sidebarOpen && <span className="font-medium ">Logout</span>}
                </button>
            </div>
        </aside>
    );
}
