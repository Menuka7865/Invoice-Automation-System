"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle, Zap, Shield, BarChart3 } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="bg-background min-h-screen">
      {/* Navigation */}
      <nav className="p-4 md:p-6 border-b max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <span className="text-2xl font-bold text-black">InvAuto</span>
        <div className="flex flex-wrap justify-center items-center gap-4 md:gap-8 text-sm font-medium">
          <Link href="#features" className="hover:text-primary transition-colors">Features</Link>
          {/* <Link href="#pricing" className="hover:text-primary transition-colors">Pricing</Link> */}
          <Link href="/login" className="hover:text-primary transition-colors">Login</Link>
          <Link href="/signup" className="  text-gray-800 px-5 py-2 border border-black rounded-full hover:bg-primary/90 transition-all">Get Started</Link>
        </div>
      </nav>


      {/* Hero Section */}
      <section className="py-16 md:py-24 px-6 text-center max-w-5xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-6xl font-extrabold tracking-tight mb-8"
        >
          Automate Your Invoicing with <span className="text-primary">AI Intelligence</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-lg md:text-xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed"
        >
          The complete web-based "Invoice Automation System" with modern architecture, role-based access control, and powerful AI insights.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row justify-center gap-4"
        >
          <Link href="/signup" className="bg-green-300 text-black px-8 py-4 rounded-2xl font-semibold flex items-center justify-center gap-2 hover:scale-105 transition-transform">
            Start Free <ArrowRight size={20} />
          </Link>
          {/* <Link href="#demo" className="bg-muted px-8 py-4 rounded-2xl font-semibold border-black border hover:bg-muted/80 transition-all flex items-center justify-center">
            View Demo
          </Link> */}
        </motion.div>

      </section>

      {/* Feature Grid */}
      <section id="features" className="py-24 px-6 bg-muted/30">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: Zap, title: "Fast Quotations", desc: "Create professional quotations in seconds with templates." },
            { icon: Shield, title: "Secure & Reliable", desc: "Enterprise-grade security with role-based access control." },
            { icon: BarChart3, title: "AI Analytics", desc: "Get revenue forecasts and payment pattern insights." },
          ].map((feature, i) => (
            <div key={i} className="p-8 bg-card rounded-3xl border hover:shadow-xl transition-shadow group">
              <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                <feature.icon size={28} />
              </div>
              <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats Counter */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 text-center">
          {[
            { label: "Active Users", value: "10K+" },
            { label: "Invoices Generated", value: "1M+" },
            { label: "Revenue Saved", value: "$50M+" },
            { label: "Customer Satisfaction", value: "99.9%" },
          ].map((stat, i) => (
            <div key={i}>
              <h4 className="text-4xl font-extrabold mb-2">{stat.value}</h4>
              <p className="text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
