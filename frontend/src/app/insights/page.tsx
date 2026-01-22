"use client";

import { useEffect, useState } from 'react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar, Cell, AreaChart, Area, ScatterChart, Scatter, ZAxis
} from 'recharts';
import {
    Sparkles, TrendingUp, AlertTriangle, Target,
    Lightbulb, ArrowRight, BrainCircuit, Wallet
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { useCompanyProfile } from '@/hooks/useCompanyProfile';
import { motion } from 'framer-motion';
import { aiAPI } from '@/lib/api';

const forecastData = [
    { name: 'Week 1', actual: 4000, predicted: 4200 },
    { name: 'Week 2', actual: 3000, predicted: 3500 },
    { name: 'Week 3', actual: 4500, predicted: 4800 },
    { name: 'Week 4', actual: null, predicted: 5200 },
    { name: 'Week 5', actual: null, predicted: 5800 },
];

export default function InsightsPage() {
    const [aiInsights, setAiInsights] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const { profile: companyProfile } = useCompanyProfile();

    const fetchAnalysis = async () => {
        setLoading(true);
        try {
            const { data } = await aiAPI.getInsights();
            setAiInsights(data);
        } catch (error) {
            console.error('Failed to load insights', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAnalysis();
    }, []);

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
                <button
                    onClick={fetchAnalysis}
                    disabled={loading}
                    className="flex items-center gap-2 bg-primary text-black px-6 py-3 rounded-2xl font-bold shadow-xl shadow-primary/20 hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <BrainCircuit size={20} className={loading ? "animate-pulse" : ""} />
                    {loading ? "Analyzing..." : "Refresh AI Analysis"}
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
                                    formatter={(value: number | undefined) => formatCurrency(value || 0, companyProfile?.currency)}
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
                            <h4 className="font-bold text-lg">Smart Insights</h4>
                        </div>
                        <div className="text-emerald-50/90 leading-relaxed mb-6 whitespace-pre-line">
                            {loading ? (
                                <div className="space-y-2 animate-pulse">
                                    <div className="h-4 bg-emerald-400/30 rounded w-full"></div>
                                    <div className="h-4 bg-emerald-400/30 rounded w-5/6"></div>
                                    <div className="h-4 bg-emerald-400/30 rounded w-4/6"></div>
                                </div>
                            ) : aiInsights?.insights || "No specific insights available at the moment."}
                        </div>
                        <button className="flex items-center gap-2 text-sm font-bold bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl transition-all">
                            View Details <ArrowRight size={16} />
                        </button>
                    </div>

                    <div className="bg-card p-8 rounded-[2.5rem] border shadow-sm">
                        <div className="flex items-center gap-3 mb-6">
                            <Lightbulb size={24} className="text-amber-500" />
                            <h4 className="font-bold text-lg">Business Recommendations</h4>
                        </div>
                        <div className="space-y-4 text-sm text-muted-foreground">
                            {loading ? (
                                <div className="space-y-3 animate-pulse">
                                    <div className="h-8 bg-muted rounded-2xl w-full"></div>
                                    <div className="h-8 bg-muted rounded-2xl w-full"></div>
                                </div>
                            ) : (
                                aiInsights?.recommendations?.length > 0 ? (
                                    aiInsights.recommendations.map((rec: string, idx: number) => (
                                        <div key={idx} className="p-4 bg-muted/50 rounded-2xl border border-dashed flex gap-2">
                                            <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                                            {rec}
                                        </div>
                                    ))
                                ) : (
                                    <p>Based on your current data, focus on maintaining healthy client relationships and ensuring timely payments.</p>
                                )
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
