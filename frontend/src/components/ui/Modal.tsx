"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-6">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
                />
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative bg-linear-to-br from-card via-card to-muted/30 w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/20 backdrop-blur-xl"
                >
                    <div className="flex items-center justify-between p-6 border-b">
                        <h3 className="text-xl font-bold">{title}</h3>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-muted rounded-full transition-colors text-muted-foreground"
                        >
                            <X size={20} />
                        </button>
                    </div>
                    <div className="p-6 max-h-[80vh] overflow-y-auto">
                        {children}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
