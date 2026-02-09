"use client";
export const dynamic = 'force-dynamic';

import Link from "next/link";
import { ArrowRight, Users, DollarSign, Calendar } from "lucide-react";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import { useEffect } from "react";

export default function DashboardPage() {
    const { activeDeals, pipelineValue, totalContacts, pendingTasks, fetchStats, loading } = useDashboardStats();

    useEffect(() => {
        fetchStats();
    }, [fetchStats]);

    return (
        <div className="space-y-8 animate-fadeIn">
            {/* Welcome Hero */}
            <div className="bg-gradient-to-r from-[#004A8D] to-[#00AEEF] rounded-2xl p-8 text-white shadow-lg relative overflow-hidden">
                <div className="relative z-10">
                    <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                        ¡Hola, Usuario! 👋
                    </h1>
                    <p className="opacity-90 max-w-xl">
                        Aquí tienes el pulso de tu negocio hoy. Tienes <b>{pendingTasks} tareas</b> pendientes y <b>${pipelineValue.toLocaleString()}</b> en oportunidades activas.
                    </p>
                    <div className="mt-6 flex gap-3">
                        <Link href="/dashboard/deals" className="bg-white/20 hover:bg-white/30 backdrop-blur-sm px-4 py-2 rounded-lg text-sm font-semibold transition-colors border border-white/30 flex items-center gap-2">
                            Ir al Pipeline <ArrowRight size={16} />
                        </Link>
                    </div>
                </div>
                {/* Abstract Deco */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
                <div className="absolute bottom-0 right-20 w-32 h-32 bg-green-400/20 rounded-full blur-2xl" />
            </div>

            {/* Stats Grid */}
            <div id="dashboard-stats" className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Card 1: Active Deals */}
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
                    {loading && <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] z-10 animate-pulse" />}
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><BriefcaseIcon /></div>
                        <span className="text-xs font-bold text-green-500 bg-green-50 px-2 py-1 rounded-full">+100%</span>
                    </div>
                    <p className="text-sm font-medium text-gray-500">Negocios Activos</p>
                    <p className="text-2xl font-bold text-gray-800">{activeDeals}</p>
                </div>

                {/* Card 2: Pipeline Value */}
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
                    {loading && <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] z-10 animate-pulse" />}
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-2 bg-green-50 text-green-600 rounded-lg"><DollarSign size={20} /></div>
                        <span className="text-xs font-bold text-green-500 bg-green-50 px-2 py-1 rounded-full">+100%</span>
                    </div>
                    <p className="text-sm font-medium text-gray-500">Valor en Pipeline</p>
                    <p className="text-2xl font-bold text-gray-800">${pipelineValue.toLocaleString()}</p>
                </div>

                {/* Card 3: Total Contacts */}
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
                    {loading && <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] z-10 animate-pulse" />}
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-2 bg-purple-50 text-purple-600 rounded-lg"><Users size={20} /></div>
                        <span className="text-xs font-medium text-gray-400">Total</span>
                    </div>
                    <p className="text-sm font-medium text-gray-500">Contactos</p>
                    <p className="text-2xl font-bold text-gray-800">{totalContacts}</p>
                </div>

                {/* Card 4: Tasks (Static/API Pending) */}
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-2 bg-orange-50 text-orange-600 rounded-lg"><Calendar size={20} /></div>
                        <span className="text-xs font-bold text-orange-500 bg-orange-50 px-2 py-1 rounded-full">!</span>
                    </div>
                    <p className="text-sm font-medium text-gray-500">Tareas Pendientes</p>
                    <p className="text-2xl font-bold text-gray-800">{pendingTasks}</p>
                </div>
            </div>
        </div>
    );
}

function BriefcaseIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="7" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>
    )
}
