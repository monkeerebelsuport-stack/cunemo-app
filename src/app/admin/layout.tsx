"use client";

import { useProfile } from "@/hooks/useProfile";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";
import { ShieldAlert, TrendingUp, Users, DollarSign, LifeBuoy } from "lucide-react";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen bg-slate-50 dark:bg-slate-950">
            {/* Sidebar Corporativo - Custom para Admin */}
            <aside className="w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col">
                <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
                    <div className="p-2 bg-amber-500/10 rounded-lg">
                        <ShieldAlert className="w-6 h-6 text-amber-600" />
                    </div>
                    <div>
                        <h1 className="font-bold text-slate-900 dark:text-white">Cunemo Center</h1>
                        <p className="text-[10px] text-amber-600 font-bold uppercase tracking-widest">Executive Access</p>
                    </div>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    <a href="/admin" className="flex items-center gap-3 p-3 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-medium">
                        <TrendingUp className="w-5 h-5 text-indigo-500" />
                        Dashboard Global
                    </a>
                    <a href="/admin/users" className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400">
                        <Users className="w-5 h-5" />
                        Edificio (Inquilinos)
                    </a>
                    <a href="/admin/finance" className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400">
                        <DollarSign className="w-5 h-5" />
                        Finanzas & Socios
                    </a>
                    <a href="/admin/support" className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400">
                        <LifeBuoy className="w-5 h-5" />
                        Soporte Elite
                    </a>
                </nav>

                <div className="p-4 border-t border-slate-100 dark:border-slate-800">
                    <a href="/dashboard" className="flex items-center gap-2 text-xs text-slate-500 hover:text-indigo-500 transition-colors">
                        ← Volver al CRM normal
                    </a>
                </div>
            </aside>

            <main className="flex-1 flex flex-col overflow-hidden">
                <Header />
                <div className="flex-1 overflow-y-auto p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
