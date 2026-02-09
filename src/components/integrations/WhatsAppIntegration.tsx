"use client";

import { useState } from "react";
import { Zap, CheckCircle, Code, Info, ArrowLeft, Smartphone, ShieldCheck } from "lucide-react";
import WhatsAppQR from "./WhatsAppQR";
import WhatsAppManager from "./WhatsAppManager";
import { supabase } from "@/lib/supabase";
import { useEffect } from "react";

interface WhatsAppIntegrationProps {
    onBack: () => void;
}

export default function WhatsAppIntegration({ onBack }: WhatsAppIntegrationProps) {
    const [mode, setMode] = useState<"select" | "qr" | "managed" | "active">("select");
    const [activeInstance, setActiveInstance] = useState<any>(null);

    useEffect(() => {
        checkIntegrationStatus();
    }, []);

    const checkIntegrationStatus = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data } = await supabase
            .from('integrations')
            .select('*')
            .eq('user_id', user.id)
            .eq('provider', 'whatsapp')
            .single();

        if (data && data.settings?.type === 'unofficial') {
            setActiveInstance(data);
            setMode("active");
        }
    };

    const handleSelectMode = (newMode: "qr" | "managed") => {
        setMode(newMode);
    };

    const handleConnectionSuccess = () => {
        checkIntegrationStatus();
    };

    const handleDisconnect = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        await supabase
            .from('integrations')
            .delete()
            .eq('user_id', user.id)
            .eq('provider', 'whatsapp');

        setMode("select");
        setActiveInstance(null);
    };

    return (
        <div className="space-y-8 animate-fadeIn">
            {/* Header */}
            <div className="flex items-center gap-4">
                <button
                    onClick={onBack}
                    className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-400 hover:text-gray-600"
                >
                    <ArrowLeft size={20} />
                </button>
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Configurar WhatsApp API</h2>
                    <p className="text-sm text-gray-500">Automatiza tus ventas y centraliza tus chats en un solo lugar.</p>
                </div>
            </div>

            {mode === "select" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Opción Unofficial (QR) */}
                    <div
                        onClick={() => handleSelectMode("qr")}
                        className="bg-white p-8 rounded-3xl border-2 border-gray-100 hover:border-blue-200 cursor-pointer transition-all hover:shadow-xl group"
                    >
                        <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <Smartphone size={28} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">Conexión QR (No Oficial)</h3>
                        <p className="text-sm text-gray-500 leading-relaxed mb-6">
                            La forma más rápida de empezar. Escanea un código QR como en WhatsApp Web. Sin costos de Meta y configuración instantánea.
                        </p>
                        <ul className="space-y-3 mb-8">
                            <li className="flex items-center gap-2 text-xs text-gray-600">
                                <CheckCircle size={14} className="text-green-500" /> Cero configuración técnica
                            </li>
                            <li className="flex items-center gap-2 text-xs text-gray-600">
                                <CheckCircle size={14} className="text-green-500" /> Sin cargos por mensaje
                            </li>
                            <li className="flex items-center gap-2 text-xs text-gray-600">
                                <CheckCircle size={14} className="text-green-500" /> Sincronización inmediata
                            </li>
                        </ul>
                        <button className="w-full py-3 bg-gray-50 text-gray-600 font-bold rounded-xl group-hover:bg-[#00AEEF] group-hover:text-white transition-colors">
                            Vincular vía QR
                        </button>
                    </div>

                    {/* Opción Managed */}
                    <div
                        onClick={() => {/* handleSelectMode("managed") */ }}
                        className="bg-[#004A8D] p-8 rounded-3xl border-2 border-[#004A8D] cursor-not-allowed opacity-90 transition-all shadow-blue-900/20 group relative overflow-hidden"
                    >
                        <div className="absolute top-4 right-4 flex gap-2">
                            <div className="bg-yellow-400 text-blue-900 text-[10px] font-black px-2 py-1 rounded-full uppercase tracking-widest">
                                Recomendado
                            </div>
                            <div className="bg-white/20 text-white text-[10px] font-black px-2 py-1 rounded-full uppercase tracking-widest border border-white/30 backdrop-blur-sm">
                                Próximamente
                            </div>
                        </div>
                        <div className="w-14 h-14 bg-white/10 text-white rounded-2xl flex items-center justify-center mb-6">
                            <Zap size={28} />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Cunemo Premium</h3>
                        <p className="text-sm text-white/70 leading-relaxed mb-6">
                            Nosotros nos encargamos de todo. Sin configuraciones técnicas. Activa WhatsApp en 5 minutos y empieza a vender.
                        </p>
                        <ul className="space-y-3 mb-8">
                            <li className="flex items-center gap-2 text-xs text-white/80">
                                <CheckCircle size={14} className="text-yellow-400" /> Activación instantánea
                            </li>
                            <li className="flex items-center gap-2 text-xs text-white/80">
                                <CheckCircle size={14} className="text-yellow-400" /> Soporte técnico incluido
                            </li>
                            <li className="flex items-center gap-2 text-xs text-white/80">
                                <CheckCircle size={14} className="text-yellow-400" /> Inbox unificado gratis
                            </li>
                        </ul>
                        <button disabled className="w-full py-3 bg-white/10 text-white/50 font-bold rounded-xl border border-white/20">
                            Próximamente
                        </button>
                    </div>
                </div>
            )}

            {mode === "qr" && (
                <div className="space-y-6">
                    <button
                        onClick={() => setMode("select")}
                        className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
                    >
                        <ArrowLeft size={14} /> Volver a opciones
                    </button>
                    <WhatsAppQR onSuccess={handleConnectionSuccess} />
                </div>
            )}

            {mode === "managed" && (
                <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm text-center space-y-8 animate-fadeIn">
                    <div className="max-w-md mx-auto space-y-4">
                        <div className="w-20 h-20 bg-blue-50 text-[#004A8D] rounded-full flex items-center justify-center mx-auto mb-6">
                            <Zap size={40} className="fill-current" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-800">¡Excelente elección!</h3>
                        <p className="text-sm text-gray-500">
                            Estás a un paso de automatizar tu comunicación. El plan Premium incluye:
                        </p>
                        <div className="bg-gray-50 p-6 rounded-2xl text-left space-y-4">
                            <div className="flex items-center gap-3">
                                <CheckCircle className="text-green-500" size={18} />
                                <span className="text-sm text-gray-700">Meta API Costs Incluidos (hasta 1,000 conv/mes)</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <CheckCircle className="text-green-500" size={18} />
                                <span className="text-sm text-gray-700">Multi-agente: Todos tus vendedores en un solo número</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <CheckCircle className="text-green-500" size={18} />
                                <span className="text-sm text-gray-700">Respuestas rápidas y Bots de calificación básica</span>
                            </div>
                        </div>
                        <div className="pt-6 space-y-4">
                            <button className="w-full py-4 bg-[#004A8D] text-white font-bold rounded-2xl shadow-xl shadow-blue-500/20 hover:bg-blue-800 transition-colors">
                                Proceder al Pago Seguro
                            </button>
                            <button
                                onClick={() => setMode("select")}
                                className="text-xs font-bold text-gray-400 hover:text-gray-600 block mx-auto"
                            >
                                Volver a opciones
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {mode === "active" && activeInstance && (
                <WhatsAppManager
                    instanceName={activeInstance.settings?.instance_name || "Cunemo_Instance"}
                    status="connected"
                    onDisconnect={handleDisconnect}
                />
            )}
        </div>
    );
}
