"use client";

import { ArrowLeft, Rocket, CheckCircle2, ShieldCheck, Zap, LucideIcon } from "lucide-react";

interface ComingSoonIntegrationProps {
    name: string;
    icon: LucideIcon;
    color: string;
    features: string[];
    onBack: () => void;
}

export default function ComingSoonIntegration({ name, icon: Icon, color, features, onBack }: ComingSoonIntegrationProps) {
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
                    <h2 className="text-2xl font-bold text-gray-800">{name}</h2>
                    <p className="text-sm text-gray-500">Próximamente en Anderson CRM.</p>
                </div>
            </div>

            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-12 text-center space-y-8">
                    <div className={`w-24 h-24 mx-auto rounded-3xl flex items-center justify-center bg-gray-50 ${color} shadow-inner`}>
                        <Icon size={48} />
                    </div>

                    <div className="max-w-md mx-auto space-y-4">
                        <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest">
                            <Rocket size={12} /> Fase de Desarrollo
                        </div>
                        <h3 className="text-3xl font-bold text-gray-800">Estamos construyendo algo grande</h3>
                        <p className="text-sm text-gray-500 leading-relaxed">
                            La integración con {name} está en nuestra prioridad #1. Muy pronto podrás automatizar tu flujo de trabajo sin salir del CRM.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto pt-8">
                        {features.map((feature, i) => (
                            <div key={i} className="p-4 bg-gray-50/50 rounded-2xl border border-gray-50 flex flex-col items-center gap-3 text-center">
                                <CheckCircle2 className="text-green-500" size={20} />
                                <span className="text-xs font-medium text-gray-600 leading-tight">{feature}</span>
                            </div>
                        ))}
                    </div>

                    <div className="pt-12 border-t border-gray-50 max-w-lg mx-auto">
                        <div className="flex items-center justify-center gap-8 mb-8">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-gray-300">85%</div>
                                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Infraestructura</div>
                            </div>
                            <div className="w-px h-8 bg-gray-100" />
                            <div className="text-center">
                                <div className="text-2xl font-bold text-gray-300">40%</div>
                                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Interfaz</div>
                            </div>
                        </div>

                        <button
                            disabled
                            className="w-full py-4 bg-gray-100 text-gray-400 font-bold rounded-2xl flex items-center justify-center gap-2 cursor-not-allowed"
                        >
                            <Zap size={18} /> Notificarme cuando esté listo
                        </button>
                    </div>
                </div>

                <div className="bg-gray-50 p-6 flex items-center justify-center gap-8 border-t border-gray-100 opacity-50">
                    <div className="flex items-center gap-2 text-xs font-medium text-gray-400">
                        <ShieldCheck size={16} /> Seguridad Verificada
                    </div>
                    <div className="flex items-center gap-2 text-xs font-medium text-gray-400">
                        <Zap size={16} /> API de Alto Rendimiento
                    </div>
                </div>
            </div>
        </div>
    );
}
