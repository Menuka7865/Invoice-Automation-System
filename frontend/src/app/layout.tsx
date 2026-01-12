
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "InvAuto | Modern Invoice Automation",
  description: "AI-powered invoice and quotation management system.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <DashboardLayout>
          {children}
        </DashboardLayout>
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
