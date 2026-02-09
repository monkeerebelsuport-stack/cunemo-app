"use client";

import { Plus, LifeBuoy, Clock } from "lucide-react";

export default function TicketsPage() {
    return (
        <div className="space-y-8 animate-fadeIn">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                        Tickets de Soporte 🎫
                    </h1>
                    <p className="text-gray-500 mt-2">Centraliza y gestiona las solicitudes de tus clientes.</p>
                </div>
                <button className="btn-primary">
                    <Plus size={18} /> Abrir Ticket
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-blue-50/50 p-6 rounded-2xl border border-blue-100">
                    <div className="text-blue-600 font-bold text-2xl mb-1">0</div>
                    <div className="text-blue-500 text-xs font-bold uppercase tracking-wider">Abiertos</div>
                </div>
                <div className="bg-orange-50/50 p-6 rounded-2xl border border-orange-100">
                    <div className="text-orange-600 font-bold text-2xl mb-1">0h</div>
                    <div className="text-orange-500 text-xs font-bold uppercase tracking-wider">Tiempo de Respuesta</div>
                </div>
                <div className="bg-green-50/50 p-6 rounded-2xl border border-green-100">
                    <div className="text-green-600 font-bold text-2xl mb-1">100%</div>
                    <div className="text-green-500 text-xs font-bold uppercase tracking-wider">Satisfacción</div>
                </div>
            </div>

            <div className="bg-white p-12 rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center">
                <div className="w-20 h-20 bg-blue-50 text-[#00AEEF] rounded-full flex items-center justify-center mb-6">
                    <LifeBuoy size={40} />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Centro de Servicio Proactivo</h3>
                <p className="text-gray-500 max-w-sm mb-8">
                    Próximamente: Implementaremos el módulo de soporte completo para que nunca pierdas el hilo de las necesidades de tus clientes.
                </p>
                <div className="bg-gray-50 p-4 rounded-xl flex items-center gap-3 text-sm text-gray-400">
                    <Clock size={16} /> Beta disponible en el próximo Sprint
                </div>
            </div>
        </div>
    );
}
