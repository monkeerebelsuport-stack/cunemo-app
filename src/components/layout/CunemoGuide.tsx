"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { HelpCircle, ChevronRight, CheckCircle2, Trophy, Sparkles, X, Lightbulb } from "lucide-react";

interface Mission {
    id: string;
    title: string;
    description: string;
    isCompleted: boolean;
}

const contextHelp: Record<string, { title: string; content: string; tip: string }> = {
    "/dashboard": {
        title: "Tu Centro de Mando 📊",
        content: "Aquí tienes el pulso de tu negocio. El gráfico muestra dónde está concentrado tu dinero por etapas.",
        tip: "Fíjate en el valor total del pipeline para tu forecast mensual."
    },
    "/dashboard/deals": {
        title: "El Pipeline de Oro 📈",
        content: "Arrastra negocios de izquierda a derecha para avanzar en la venta. El 'SC%' te indica el riesgo de perder el trato.",
        tip: "Los negocios en rojo necesitan una llamada de seguimiento ¡YA!"
    },
    "/dashboard/contacts": {
        title: "Tu Red de Contactos 👥",
        content: "Centraliza a las personas clave. Un buen CRM se alimenta de relaciones sólidas.",
        tip: "Añade notas a cada contacto para no olvidar detalles importantes."
    },
    "/dashboard/integrations": {
        title: "Superpoderes 🔌",
        content: "CunemoClient no es una isla. Conecta WhatsApp o Email para automatizar todo.",
        tip: "Activar WhatsApp reduce el tiempo de respuesta en un 40%."
    }
};

export default function CunemoGuide() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const [missions] = useState<Mission[]>([
        { id: "comp", title: "Crea tu primera Empresa", description: "Ve a Empresas y añade tu primer aliado corporativo.", isCompleted: false },
        { id: "deal", title: "Inicia tu primer Negocio", description: "Añade un negocio al Pipeline para empezar a ganar.", isCompleted: false },
        { id: "notif", title: "Revisa tus Alertas", description: "Abre la campana de notificaciones.", isCompleted: false }
    ]);

    const currentContext = contextHelp[pathname] || {
        title: "Asistente Inteligente 🤖",
        content: "Estoy aquí para ayudarte a navegar CunemoClient. ¿Tienes alguna duda específica?",
        tip: "En cualquier momento puedes preguntarme cómo cerrar más tratos."
    };

    const completedCount = missions.filter(m => m.isCompleted).length;
    const progress = (completedCount / missions.length) * 100;

    return (
        <div className="fixed bottom-8 right-8 z-[100]">
            {/* Main Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`
                    group relative w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300
                    ${isOpen ? "bg-slate-800 rotate-90 scale-90" : "bg-gradient-to-br from-[#004A8D] to-[#00AEEF] hover:scale-110 active:scale-95"}
                `}
            >
                {isOpen ? <X className="text-white" /> : <HelpCircle className="text-white" size={28} />}

                {/* Notification Badge (for missions) */}
                {!isOpen && completedCount < missions.length && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-orange-500 border-2 border-white rounded-full flex items-center justify-center text-[10px] text-white font-bold animate-pulse">
                        !
                    </span>
                )}
            </button>

            {/* Guide Panel */}
            {isOpen && (
                <div className="absolute bottom-20 right-0 w-[350px] bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-gray-100 overflow-hidden animate-slideDown">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-[#004A8D] to-[#00AEEF] p-6 text-white text-center relative overflow-hidden">
                        <Trophy size={80} className="absolute -right-6 -bottom-6 opacity-10 rotate-12" />
                        <h3 className="text-lg font-bold mb-1">CunemoGuide Copilot 🤖</h3>
                        <p className="text-[11px] opacity-80 uppercase tracking-widest font-bold">Asistente Inteligente Proactivo</p>
                    </div>

                    <div className="p-6 space-y-6 max-h-[500px] overflow-y-auto custom-scrollbar">
                        {/* Context Section */}
                        <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100">
                            <div className="flex items-center gap-2 mb-2 text-[#004A8D]">
                                <Sparkles size={16} />
                                <h4 className="font-bold text-sm tracking-tight">{currentContext.title}</h4>
                            </div>
                            <p className="text-xs text-gray-700 leading-relaxed mb-3">
                                {currentContext.content}
                            </p>
                            <div className="flex items-start gap-2 bg-white/60 p-2 rounded-lg text-[10px] text-blue-600 font-medium italic">
                                <Lightbulb size={14} className="flex-shrink-0" />
                                <span>Tip: {currentContext.tip}</span>
                            </div>
                        </div>

                        {/* Missions Section */}
                        <div className="space-y-4">
                            <div className="flex justify-between items-end mb-2">
                                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Misiones de Éxito</h4>
                                <span className="text-[10px] font-bold text-[#8DC63F]">{completedCount}/{missions.length} completadas</span>
                            </div>

                            {/* Simple Progress Bar */}
                            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden mb-4">
                                <div className="h-full bg-[#8DC63F] transition-all duration-700" style={{ width: `${progress}%` }} />
                            </div>

                            {missions.map(m => (
                                <div key={m.id} className={`flex items-start gap-3 p-3 rounded-xl border transition-all ${m.isCompleted ? "bg-green-50 border-green-100 opacity-60" : "bg-white border-gray-100 hover:border-blue-200"}`}>
                                    <div className={`mt-0.5 ${m.isCompleted ? "text-green-500" : "text-gray-300"}`}>
                                        <CheckCircle2 size={18} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-gray-800">{m.title}</p>
                                        <p className="text-[10px] text-gray-400 mt-1">{m.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <button
                            className="w-full py-3 bg-gray-50 hover:bg-gray-100 rounded-xl text-[11px] font-bold text-gray-500 border border-gray-100 flex items-center justify-center gap-2 transition-colors"
                            onClick={() => window.open("/dashboard/tickets", "_self")}
                        >
                            Hablar con asistencia humana <ChevronRight size={14} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
