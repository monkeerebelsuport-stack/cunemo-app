"use client";

import { Card } from "@/components/ui/card";
import { TrendingUp, Users, DollarSign, MessageSquare, Activity, ShieldCheck } from "lucide-react";

export default function AdminDashboard() {
    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div>
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                    Executive Command Center <ShieldCheck className="w-8 h-8 text-amber-500" />
                </h2>
                <p className="text-slate-500 dark:text-slate-400">Panel de control corporativo y financiero de Cunemo CRM.</p>
            </div>

            {/* KPIs Corporativos */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="p-6 border-slate-100 dark:border-slate-800 shadow-sm">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-slate-500">Ingresos Totales (LTV)</p>
                            <h3 className="text-2xl font-bold mt-1 text-slate-900 dark:text-white">$0.00</h3>
                        </div>
                        <div className="p-2 bg-green-500/10 rounded-lg">
                            <DollarSign className="w-5 h-5 text-green-600" />
                        </div>
                    </div>
                    <p className="text-xs text-slate-400 mt-4 flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" /> +0% desde el último mes
                    </p>
                </Card>

                <Card className="p-6 border-slate-100 dark:border-slate-800 shadow-sm">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-slate-500">Inquilinos Activos</p>
                            <h3 className="text-2xl font-bold mt-1 text-slate-900 dark:text-white">1</h3>
                        </div>
                        <div className="p-2 bg-blue-500/10 rounded-lg">
                            <Users className="w-5 h-5 text-blue-600" />
                        </div>
                    </div>
                    <p className="text-xs text-slate-400 mt-4">Anderson (Fundador)</p>
                </Card>

                <Card className="p-6 border-slate-100 dark:border-slate-800 shadow-sm">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-slate-500">Conversaciones WA</p>
                            <h3 className="text-2xl font-bold mt-1 text-slate-900 dark:text-white">0</h3>
                        </div>
                        <div className="p-2 bg-indigo-500/10 rounded-lg">
                            <MessageSquare className="w-5 h-5 text-indigo-600" />
                        </div>
                    </div>
                    <p className="text-xs text-slate-400 mt-4 underline decoration-indigo-500/30">Esperando motor real...</p>
                </Card>

                <Card className="p-6 border-slate-100 dark:border-slate-800 shadow-sm">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-slate-500">Uptime VPS</p>
                            <h3 className="text-2xl font-bold mt-1 text-slate-900 dark:text-white">--</h3>
                        </div>
                        <div className="p-2 bg-slate-500/10 rounded-lg">
                            <Activity className="w-5 h-5 text-slate-600" />
                        </div>
                    </div>
                    <p className="text-xs text-slate-400 mt-4">Offline (DOKPLOY REQUERIDO)</p>
                </Card>
            </div>

            {/* Sección Informativa para el CEO */}
            <Card className="p-8 border-amber-500/20 bg-amber-500/5">
                <h4 className="font-bold text-amber-700 dark:text-amber-500 flex items-center gap-2">
                    🚀 Misión Actual: Despliegue del Edificio Corporativo
                </h4>
                <div className="mt-4 space-y-4 text-sm text-slate-600 dark:text-slate-400">
                    <p>Para activar el **Command Center** al 100%, necesitamos completar dos pasos críticos:</p>
                    <ul className="list-disc list-inside space-y-2">
                        <li><strong>Paso 1:</strong> Ejecutar el script <code>set_admin_role.sql</code> en el editor SQL de Supabase para darte la "llave maestra".</li>
                        <li><strong>Paso 2:</strong> Activar el VPS (Sugerido: Ubuntu 24.04, 4GB RAM) y pasarme las credenciales para instalar **Dokploy**.</li>
                    </ul>
                </div>
            </Card>
        </div>
    );
}
