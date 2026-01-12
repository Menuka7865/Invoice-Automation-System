"use client";

import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar, Cell, AreaChart, Area, ScatterChart, Scatter, ZAxis
} from 'recharts';
import {
    Sparkles, TrendingUp, AlertTriangle, Target,
    Lightbulb, ArrowRight, BrainCircuit, Wallet
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { motion } from 'framer-motion';

const forecastData = [
    { name: 'Week 1', actual: 4000, predicted: 4200 },
    { name: 'Week 2', actual: 3000, predicted: 3500 },
    { name: 'Week 3', actual: 4500, predicted: 4800 },
    { name: 'Week 4', actual: null, predicted: 5200 },
    { name: 'Week 5', actual: null, predicted: 5800 },
];

const riskData = [
    { name: 'Acme Corp', score: 15, value: 5000 },
    { name: 'Global Tech', score: 45, value: 12000 },
    { name: 'Nexus Soft', score: 85, value: 3500 },
    { name: 'Stellar Inc', score: 10, value: 8000 },
    { name: 'Mega Corp', score: 65, value: 15000 },
];

export default function InsightsPage() {
    return (
        <div className="space-y-10 pb-20">
            <div className="flex justify-between items-end">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <div className="p-1.5 bg-primary/10 rounded-lg">
                            <Sparkles size={18} className="text-primary" />
                        </div>
                        <span className="text-sm font-bold text-primary tracking-widest uppercase">AI Intelligence</span>
                    </div>
                    <h1 className="text-4xl font-extrabold tracking-tight">Financial Insights</h1>
                    <p className="text-muted-foreground mt-1">Predictive analytics and smart recommendations for your business.</p>
                </div>
                <button className="flex items-center gap-2 bg-primary text-black px-6 py-3 rounded-2xl font-bold shadow-xl shadow-primary/20 hover:scale-105 transition-all">
                    <BrainCircuit size={20} /> Refresh AI Analysis
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Revenue Forecast */}
                <div className="lg:col-span-2 bg-card p-8 rounded-[2.5rem] border shadow-sm relative overflow-hidden">
                    <div className="flex justify-between items-center mb-10">
                        <div>
                            <h3 className="text-xl font-bold">Revenue Forecast</h3>
                            <p className="text-sm text-muted-foreground">Next 30 days projection</p>
                        </div>
                        <div className="flex items-center gap-4 text-xs font-bold">
                            <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-primary"></div> Actual</div>
                            <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-primary/30 border border-primary border-dashed"></div> Predicted</div>
                        </div>
                    </div>
                    <div className="h-[350px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={forecastData}>
                                <defs>
                                    <linearGradient id="colorPred" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#fff', borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}
                                />
                                <Area type="monotone" dataKey="predicted" stroke="#8b5cf6" strokeWidth={3} strokeDasharray="5 5" fill="url(#colorPred)" />
                                <Area type="monotone" dataKey="actual" stroke="#8b5cf6" strokeWidth={3} fillOpacity={0} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* AI Action Cards */}
                <div className="space-y-6">
                    <div className="bg-emerald-500 p-8 rounded-[2.5rem] text-white shadow-xl shadow-emerald-500/10">
                        <div className="flex items-center gap-3 mb-4">
                            <Target size={24} className="text-emerald-100" />
                            <h4 className="font-bold text-lg">Cash Flow Tip</h4>
                        </div>
                        <p className="text-emerald-50/90 leading-relaxed mb-6">
                            Invoicing on Tuesdays instead of Fridays could improve your collection speed by <span className="font-black">18%</span> based on past data.
                        </p>
                        <button className="flex items-center gap-2 text-sm font-bold bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl transition-all">
                            Apply Strategy <ArrowRight size={16} />
                        </button>
                    </div>

                    <div className="bg-card p-8 rounded-[2.5rem] border shadow-sm">
                        <div className="flex items-center gap-3 mb-6">
                            <Lightbulb size={24} className="text-amber-500" />
                            <h4 className="font-bold text-lg">Optimization</h4>
                        </div>
                        <div className="space-y-4">
                            <div className="p-4 bg-muted rounded-2xl border border-dashed text-sm">
                                <p className="font-bold mb-1">Tax Savings</p>
                                <p className="text-muted-foreground">AI detected $1,240 in unclaimed VAT from international invoices.</p>
                            </div>
                            <button className="w-full py-3 rounded-2xl bg-primary/5 text-primary font-bold text-sm hover:bg-primary/10 transition-all">
                                Generate Report
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Customer Risk Matrix */}
            <div className="bg-card p-8 rounded-[2.5rem] border shadow-sm">
                <h3 className="text-xl font-bold mb-8 flex items-center gap-2">
                    <AlertTriangle size={20} className="text-destructive" /> Payment Risk Matrix
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                    {riskData.map((customer, i) => (
                        <motion.div
                            whileHover={{ y: -5 }}
                            key={i}
                            className="p-6 rounded-3xl border bg-muted/30 flex flex-col items-center text-center space-y-4"
                        >
                            <div className="relative">
                                <svg className="w-20 h-20 transform -rotate-90">
                                    <circle cx="40" cy="40" r="36" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-muted" />
                                    <circle cx="40" cy="40" r="36" stroke="currentColor" strokeWidth="8" fill="transparent"
                                        strokeDasharray={2 * Math.PI * 36}
                                        strokeDashoffset={2 * Math.PI * 36 * (1 - customer.score / 100)}
                                        className={customer.score > 70 ? 'text-destructive' : customer.score > 30 ? 'text-amber-500' : 'text-emerald-500'}
                                    />
                                </svg>
                                <span className="absolute inset-0 flex items-center justify-center font-black text-xs">{customer.score}%</span>
                            </div>
                            <div>
                                <p className="font-bold text-sm">{customer.name}</p>
                                <p className="text-[10px] uppercase text-muted-foreground font-bold mt-1">Exposure: {formatCurrency(customer.value)}</p>
                            </div>
                            <div className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md ${customer.score > 70 ? 'bg-destructive/10 text-destructive' : 'bg-emerald-500/10 text-emerald-500'
                                }`}>
                                {customer.score > 70 ? 'High Risk' : 'Healthy'}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
