"use client";

import { Clock, History, CheckCircle2, ChevronRight } from 'lucide-react';

export interface VersionEntry {
    id: string;
    timestamp: string;
    action: string;
    userName: string;
}

interface VersionHistoryProps {
    history: VersionEntry[];
}

export default function VersionHistory({ history }: VersionHistoryProps) {
    return (
        <div className="bg-card/30 backdrop-blur-md rounded-3xl border border-border/50 p-6 h-full flex flex-col">
            <div className="flex items-center gap-2 mb-6">
                <div className="p-2 bg-primary/10 rounded-xl text-primary">
                    <History size={18} />
                </div>
                <h3 className="font-bold text-lg">Edit History</h3>
            </div>

            <div className="grow overflow-y-auto space-y-6 pr-2 custom-scrollbar">
                {history.length === 0 ? (
                    <div className="text-center py-12">
                        <Clock size={32} className="mx-auto text-muted-foreground/30 mb-3" />
                        <p className="text-sm text-muted-foreground font-medium">No changes tracked yet</p>
                    </div>
                ) : (
                    history.map((entry, idx) => (
                        <div key={entry.id} className="relative pl-6 group">
                            {/* Timeline Line */}
                            {idx !== history.length - 1 && (
                                <div className="absolute left-[7px] top-6 bottom-[-24px] w-[2px] bg-border/50 group-hover:bg-primary/20 transition-colors" />
                            )}

                            {/* Dot */}
                            <div className="absolute left-0 top-1.5 w-4 h-4 rounded-full border-2 border-primary bg-background z-10" />

                            <div className="space-y-1">
                                <div className="flex justify-between items-start">
                                    <p className="text-sm font-bold text-foreground leading-tight">{entry.action}</p>
                                    <span className="text-[10px] font-bold text-muted-foreground uppercase whitespace-nowrap ml-2">
                                        {new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                                <p className="text-[11px] text-muted-foreground flex items-center gap-1 font-medium">
                                    <span className="text-primary font-bold">{entry.userName}</span>
                                    <span>•</span>
                                    <span>{new Date(entry.timestamp).toLocaleDateString()}</span>
                                </p>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <div className="mt-8 pt-6 border-t border-border/50">
                <div className="flex items-center justify-between p-4 bg-primary/5 rounded-2xl border border-primary/10 group cursor-pointer hover:bg-primary/10 transition-all">
                    <div>
                        <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">Current Version</p>
                        <p className="text-xs font-bold font-sans">v1.1.2 - Draft</p>
                    </div>
                    <ChevronRight size={16} className="text-primary group-hover:translate-x-1 transition-transform" />
                </div>
            </div>
        </div>
    );
}
