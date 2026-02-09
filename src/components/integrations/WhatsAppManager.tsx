"use client";

import { CheckCircle2, XCircle, Smartphone, LogOut, ShieldCheck, RefreshCw } from "lucide-react";

interface WhatsAppManagerProps {
    instanceName: string;
    status: "connected" | "disconnected" | "connecting";
    onDisconnect: () => void;
}

export default function WhatsAppManager({ instanceName, status, onDisconnect }: WhatsAppManagerProps) {
    return (
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-8 animate-fadeIn max-w-2xl mx-auto">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className={`p-4 rounded-2xl ${status === 'connected' ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'}`}>
                        <Smartphone size={32} />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-gray-800">WhatsApp Conectado</h3>
                        <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Instancia: {instanceName}</p>
                    </div>
                </div>
                <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 ${status === 'connected' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                    }`}>
                    <div className={`w-2 h-2 rounded-full ${status === 'connected' ? 'bg-green-500 animate-pulse' : 'bg-orange-500'}`}></div>
                    {status === 'connected' ? 'En Línea' : 'Reconectando'}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-1">
                    <p className="text-[10px] font-bold text-gray-400 uppercase">Mensajes Recibidos</p>
                    <p className="text-2xl font-black text-gray-800">0</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-1">
                    <p className="text-[10px] font-bold text-gray-400 uppercase">Estado del Motor</p>
                    <div className="flex items-center gap-2">
                        <CheckCircle2 size={16} className="text-green-500" />
                        <span className="text-sm font-bold text-gray-700">Auditado y Seguro</span>
                    </div>
                </div>
            </div>

            <div className="bg-blue-50/50 p-6 rounded-2xl border border-blue-50 flex items-start gap-4">
                <ShieldCheck className="text-blue-600 mt-1" size={20} />
                <div className="space-y-1">
                    <h4 className="text-sm font-bold text-blue-900">Blindaje de Datos Activo</h4>
                    <p className="text-xs text-blue-700/70">
                        Tus conversaciones están aisladas mediante RLS y cifradas. Ningún otro usuario de Cunemo puede acceder a esta instancia.
                    </p>
                </div>
            </div>

            <div className="pt-6 border-t border-gray-50 flex items-center justify-between">
                <button
                    className="text-xs font-bold text-gray-400 hover:text-blue-600 flex items-center gap-2 transition-colors"
                >
                    <RefreshCw size={14} /> Forzar Sincronización
                </button>
                <button
                    onClick={() => {
                        if (confirm("¿Estás seguro de desconectar WhatsApp? Se detendrá la recepción de mensajes en el CRM.")) {
                            onDisconnect();
                        }
                    }}
                    className="flex items-center gap-2 bg-red-50 text-red-600 px-6 py-2.5 rounded-xl text-xs font-bold hover:bg-red-100 transition-all active:scale-95 shadow-sm"
                >
                    <LogOut size={16} /> Desconectar Dispositivo
                </button>
            </div>
        </div>
    );
}
