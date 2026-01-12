"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { UserPlus, Mail, Lock, User, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { useAuth } from '@/hooks/useAuth';

const signupSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

type SignupFormValues = z.infer<typeof signupSchema>;

export default function SignupPage() {
    const router = useRouter();
    const { signup } = useAuth();

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<SignupFormValues>({
        resolver: zodResolver(signupSchema),
    });

    const onSubmit = async (data: SignupFormValues) => {
        try {
            await signup(data);
        } catch (error) {
            toast.error('Registration failed');
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
                    <h2 className="text-2xl font-bold text-foreground">Create Account</h2>
                    <p className="text-muted-foreground mt-2">Join thousands of businesses worldwide</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    <div className="space-y-2">
                        <label className="text-sm font-medium pl-1">Full Name</label>
                        <div className="relative group">
                            <User className="absolute left-4 top-3.5 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
                            <input
                                {...register('name')}
                                type="text"
                                placeholder="John Doe"
                                className="w-full bg-muted/50 border-none rounded-2xl py-3.5 pl-12 pr-4 focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                            />
                        </div>
                        {errors.name && <p className="text-destructive text-xs pl-1">{errors.name.message}</p>}
                    </div>

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
                        <label className="text-sm font-medium pl-1">Password</label>
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
                        className="w-full border border-black bg-primary text-gray-600 py-2 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 "
                    >
                        {isSubmitting ? 'Creating account...' : 'Sign Up'} <ArrowRight size={20} />
                    </button>
                </form>

                <p className="text-center mt-8 text-sm text-muted-foreground">
                    Already have an account? <Link href="/login" className="text-primary font-semibold hover:underline">Log in</Link>
                </p>
            </motion.div>
        </div>
    );
}
