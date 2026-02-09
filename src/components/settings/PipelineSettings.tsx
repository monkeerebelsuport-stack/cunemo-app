"use client";

import { usePipeline } from "@/hooks/usePipeline";
import { LayoutDashboard, Sparkles, GripVertical, AlertCircle } from "lucide-react";

export default function PipelineSettings() {
    const { state } = usePipeline();
    const columns = Object.values(state.columns);

    return (
        <div className="space-y-8 animate-fadeIn">
            <div>
                <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                    <LayoutDashboard size={20} className="text-[#00AEEF]" />
                    Estructura del Embudo
                </h3>
                <p className="text-xs text-gray-400 mt-1">
                    Visualiza y ordena las etapas por las que pasan tus negocios.
                </p>
            </div>

            <div className="space-y-3">
                {columns.map((col, index) => (
                    <div
                        key={col.id}
                        className="flex items-center gap-4 p-4 bg-white border border-gray-100 rounded-2xl hover:border-blue-100 hover:shadow-sm transition-all group"
                    >
                        <div className="text-gray-300 group-hover:text-blue-200 transition-colors">
                            <GripVertical size={20} />
                        </div>

                        <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-xs"
                            style={{ backgroundColor: col.color }}
                        >
                            {index + 1}
                        </div>

                        <div className="flex-1">
                            <h4 className="text-sm font-bold text-gray-800">{col.title}</h4>
                            <div className="flex items-center gap-3 mt-1">
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                    ID: {col.id}
                                </span>
                                {col.id === 'QUALIFIED' && (
                                    <span className="flex items-center gap-1.5 px-2 py-0.5 bg-orange-50 text-orange-500 rounded text-[9px] font-bold">
                                        <AlertCircle size={10} /> Auto-Task Activado
                                    </span>
                                )}
                                {col.id === 'WON' && (
                                    <span className="flex items-center gap-1.5 px-2 py-0.5 bg-green-50 text-green-500 rounded text-[9px] font-bold">
                                        <Sparkles size={10} /> Disparador de Onboarding
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="text-right px-4">
                            <span className="text-[10px] font-bold text-gray-300 uppercase italic">
                                {col.id === 'WON' || col.id === 'LOST' ? 'Estado Final' : 'En Progreso'}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Information Alert */}
            <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100 flex gap-4">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-[#00AEEF] shadow-sm flex-shrink-0">
                    <LayoutDashboard size={20} />
                </div>
                <div>
                    <h4 className="text-sm font-bold text-blue-800">Próximamente: Editor Dinámico</h4>
                    <p className="text-xs text-blue-600/80 leading-relaxed mt-1">
                        Estamos trabajando para que puedas añadir tus propias etapas, cambiar colores y definir reglas de automatización personalizadas para cada una.
                    </p>
                </div>
            </div>
        </div>
    );
}
