"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { LogIn, Mail, Lock, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { useAuth } from '@/hooks/useAuth';

const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
    const router = useRouter();
    const { login } = useAuth();

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginFormValues) => {
        try {
            await login(data);
        } catch (error) {
            toast.error('Invalid credentials');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-muted/30">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md bg-card p-10 rounded-3xl border shadow-xl"
            >
                <div className="text-center mb-10">
                    <Link href="/" className="text-3xl font-bold gradient-text mb-4 inline-block">InvAuto</Link>
                    <h2 className="text-2xl font-bold text-foreground">Welcome Back</h2>
                    <p className="text-muted-foreground mt-2">Log in to manage your invoices</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium pl-1">Email Address</label>
                        <div className="relative group">
                            <Mail className="absolute left-4 top-3.5 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
                            <input
                                {...register('email')}
                                type="email"
                                placeholder="name@company.com"
                                className="w-full bg-muted/50 border-none rounded-2xl py-3.5 pl-12 pr-4 focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                            />
                        </div>
                        {errors.email && <p className="text-destructive text-xs pl-1">{errors.email.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between items-center px-1">
                            <label className="text-sm font-medium">Password</label>
                            <Link href="#" className="text-xs text-primary hover:underline">Forgot password?</Link>
                        </div>
                        <div className="relative group">
                            <Lock className="absolute left-4 top-3.5 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
                            <input
                                {...register('password')}
                                type="password"
                                placeholder="••••••••"
                                className="w-full bg-muted/50 border-none rounded-2xl py-3.5 pl-12 pr-4 focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                            />
                        </div>
                        {errors.password && <p className="text-destructive text-xs pl-1">{errors.password.message}</p>}
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-primary text-gray-600 py-2 border border-black rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                    >
                        {isSubmitting ? 'Signing in...' : 'Sign In'} <ArrowRight size={20} />
                    </button>
                </form>

                <p className="text-center mt-8 text-sm text-muted-foreground">
                    Don't have an account? <Link href="/signup" className="text-primary font-semibold hover:underline">Create an account</Link>
                </p>
            </motion.div>
        </div>
    );
}
