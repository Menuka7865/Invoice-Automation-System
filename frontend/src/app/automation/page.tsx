"use client";

import {
    Clock, CheckCircle2, XCircle,
    History, Zap
} from 'lucide-react';
import { formatDate } from '@/lib/utils';

const automationLogs = [
    { id: '1', task: 'Payment Reminder', entity: 'INV-2023-002', status: 'Success', time: '2023-10-25 09:00 AM' },
    { id: '2', task: 'Weekly Report', entity: 'System', status: 'Success', time: '2023-10-22 00:00 AM' },
    { id: '3', task: 'Invoice Generation', entity: 'QT-2023-001', status: 'In Progress', time: '2023-10-26 02:30 PM' },
    { id: '4', task: 'Email Dispatch', entity: 'INV-2023-005', status: 'Failed', time: '2023-10-25 11:15 AM', error: 'SMTP Timeout' },
];

export default function AutomationPage() {
    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Automation Control</h1>
                    <p className="text-muted-foreground">Manage background jobs, scheduled tasks, and event triggers.</p>
                </div>
                <div className="flex items-center gap-2 bg-emerald-500/10 text-emerald-500 px-4 py-2 rounded-xl text-sm font-bold border border-emerald-500/20">
                    <Zap size={16} /> All systems operational
                </div>
            </div>

            <div className="grid grid-cols-1 gap-8">
                {/* Active Automations */}
                <div className="space-y-6">
                    <div className="bg-card rounded-3xl border shadow-sm overflow-hidden">
                        <div className="p-6 border-b flex justify-between items-center">
                            <h3 className="font-bold flex items-center gap-2">
                                <History size={18} className="text-primary" /> Execution Logs
                            </h3>
                            <button className="text-xs font-bold text-primary hover:underline">Clear History</button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-muted/30">
                                    <tr className="text-muted-foreground text-[10px] uppercase font-black">
                                        <th className="px-6 py-4">Task Name</th>
                                        <th className="px-6 py-4">Related To</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4">Execution Time</th>
                                        <th className="px-6 py-4 text-center">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {automationLogs.map((log) => (
                                        <tr key={log.id} className="hover:bg-muted/20 transition-colors">
                                            <td className="px-6 py-4 text-sm font-semibold">{log.task}</td>
                                            <td className="px-6 py-4 text-sm text-muted-foreground">{log.entity}</td>
                                            <td className="px-6 py-4">
                                                <div className={`flex items-center gap-2 text-[10px] font-bold uppercase w-fit px-3 py-1 rounded-full ${log.status === 'Success' ? 'bg-emerald-500/10 text-emerald-500' :
                                                    log.status === 'Failed' ? 'bg-destructive/10 text-destructive' :
                                                        'bg-primary/10 text-primary'
                                                    }`}>
                                                    {log.status === 'Success' ? <CheckCircle2 size={12} /> :
                                                        log.status === 'Failed' ? <XCircle size={12} /> :
                                                            <Clock size={12} className="animate-spin" />}
                                                    {log.status}
                                                </div>
                                                {log.error && <p className="text-[10px] text-destructive mt-1 font-medium">{log.error}</p>}
                                            </td>
                                            <td className="px-6 py-4 text-xs font-medium text-muted-foreground">{log.time}</td>
                                            <td className="px-6 py-4 text-center">
                                                <button className="text-primary text-xs font-bold hover:underline">Retry</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
