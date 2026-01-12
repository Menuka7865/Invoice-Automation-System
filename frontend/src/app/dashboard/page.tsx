"use client";

import { useEffect, useState } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, LineChart, Line, AreaChart, Area
} from 'recharts';
import {
    TrendingUp, Users, Receipt, Clock, AlertCircle,
    ArrowUpRight, ArrowDownRight
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { useInvoices } from '@/hooks/useInvoices';
import { useCustomers } from '@/hooks/useCustomers';
import { aiAPI } from '@/lib/api';
import Link from 'next/link';

export default function DashboardPage() {
    const { invoices, fetchInvoices } = useInvoices();
    const { customers } = useCustomers();
    const [aiInsights, setAiInsights] = useState<any>(null);
    const [loadingInsights, setLoadingInsights] = useState(true);

    useEffect(() => {
        const fetchInsights = async () => {
            try {
                const { data } = await aiAPI.getInsights();
                setAiInsights(data);
            } catch (error) {
                console.error('Failed to load insights', error);
            } finally {
                setLoadingInsights(false);
            }
        };
        fetchInsights();
    }, []);

    // Calculate dynamic stats from API data
    const totalRevenue = aiInsights?.totalRevenue || 0;
    const activeCustomers = aiInsights?.customers || customers.length || 0;
    const overdueAmount = aiInsights?.overdue || 0;
    const pendingInvoices = invoices.filter((i: any) => i.status !== 'Paid').length || 0;

    // Process chart data from real invoices
    const getChartData = () => {
        const months = [];
        for (let i = 5; i >= 0; i--) {
            const d = new Date();
            d.setMonth(d.getMonth() - i);
            months.push(d.toLocaleString('default', { month: 'short' }));
        }

        const monthlyTotals = invoices.reduce((acc: any, inv: any) => {
            const date = new Date(inv.createdAt);
            const monthName = date.toLocaleString('default', { month: 'short' });
            acc[monthName] = (acc[monthName] || 0) + (inv.total || 0);
            return acc;
        }, {} as Record<string, number>);

        return months.map(name => ({
            name,
            revenue: monthlyTotals[name] || 0
        }));
    };

    const dynamicChartData = getChartData();

    const dynamicStats = [
        { label: 'Total Revenue', value: totalRevenue, icon: TrendingUp, change: '+0%', isPositive: true },
        { label: 'Active Customers', value: activeCustomers, icon: Users, change: '+0%', isPositive: true },
        { label: 'Pending Invoices', value: pendingInvoices, icon: Receipt, change: '+0%', isPositive: true },
        { label: 'Overdue Amount', value: overdueAmount, icon: AlertCircle, change: '+0%', isPositive: false },
    ];

    return (
        <div className="space-y-8">
            {/* Welcome Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Dashboard Overview</h1>
                    <p className="text-muted-foreground">Welcome back! Here's what's happening with your business.</p>
                </div>
                <button className="w-full md:w-auto bg-primary text-black px-6 py-2.5 rounded-xl font-semibold shadow-lg shadow-primary/20 hover:scale-105 transition-all">
                    Generate Report
                </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {dynamicStats.map((stat, i) => (
                    <div key={i} className="bg-card p-6 rounded-3xl border shadow-sm group hover:border-primary/50 transition-colors">
                        {/* <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-muted rounded-2xl group-hover:bg-primary/10 transition-colors">
                                <stat.icon size={24} className="text-muted-foreground group-hover:text-primary" />
                            </div>
                            <div className={`flex items-center text-xs font-medium px-2 py-1 rounded-full ${stat.isPositive ? 'bg-emerald-500/10 text-emerald-500' : 'bg-destructive/10 text-destructive'
                                }`}>
                                {stat.isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                                {stat.change}
                            </div>
                        </div> */}
                        <div>
                            <p className="text-sm text-muted-foreground font-medium">{stat.label}</p>
                            <h3 className="text-2xl font-bold mt-1">
                                {stat.label.includes('Revenue') || stat.label.includes('Amount')
                                    ? formatCurrency(stat.value)
                                    : stat.value}
                            </h3>
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Chart */}
            <div className="bg-card p-8 rounded-3xl border shadow-sm">
                <div className="flex justify-between items-center mb-8">
                    <h3 className="font-bold text-lg">Revenue vs Expenses</h3>
                    <select className="bg-muted border-none rounded-lg text-sm px-3 py-1 outline-none" title='option' >
                        <option>Last 6 months</option>
                        <option>Last 12 months</option>
                    </select>
                </div>
                <div className="h-75 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={dynamicChartData}>
                            <defs>
                                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.1} />
                                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                                cursor={{ stroke: '#8b5cf6', strokeWidth: 2 }}
                            />
                            <Area type="monotone" dataKey="revenue" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                            <Area type="monotone" dataKey="expenses" stroke="#94a3b8" strokeWidth={3} fillOpacity={0} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>


            {/* Recent Invoices */}
            <div className="bg-card p-4 md:p-8 rounded-3xl border shadow-sm">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-lg">Recent Invoices</h3>
                    <button className="text-primary text-sm font-semibold hover:underline"><Link href='/invoices'>View All</Link></button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-muted-foreground text-sm border-b">
                                <th className="pb-4 font-medium">Invoice ID</th>
                                <th className="pb-4 font-medium">Customer</th>
                                <th className="pb-4 font-medium">Date</th>
                                <th className="pb-4 font-medium">Amount</th>
                                <th className="pb-4 font-medium">Status</th>
                                <th className="pb-4 font-medium">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {invoices.slice(0, 4).length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="py-8 text-center text-muted-foreground">
                                        No invoices yet.
                                    </td>
                                </tr>
                            ) : invoices.slice(0, 4).map((inv: any) => (
                                <tr key={inv._id} className="hover:bg-muted/30 transition-colors group">
                                    <td className="py-4 font-medium text-sm">{inv._id?.slice(-6) || 'N/A'}</td>
                                    <td className="py-4 text-sm">
                                        {typeof inv.customer === 'object' ? (inv.customer?.name || 'Unknown') : (inv.customer || 'Unknown')}
                                    </td>
                                    <td className="py-4 text-sm text-muted-foreground">{new Date(inv.createdAt).toLocaleDateString()}</td>
                                    <td className="py-4 text-sm font-bold">{formatCurrency(inv.total)}</td>
                                    <td className="py-4">
                                        <span className={`text-[10px] uppercase tracking-wider font-bold px-3 py-1 rounded-full ${inv.status === 'Paid' ? 'bg-emerald-500/10 text-emerald-500' :
                                            inv.status === 'Overdue' ? 'bg-destructive/10 text-destructive' :
                                                'bg-amber-500/10 text-amber-500'
                                            }`}>
                                            {inv.status}
                                        </span>
                                    </td>
                                    <td className="py-4">
                                        <button className="text-muted-foreground hover:text-primary transition-colors">Details</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>


    );
}
