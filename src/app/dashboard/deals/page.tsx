"use client";
export const dynamic = 'force-dynamic';
import KanbanBoard from "@/components/pipeline/KanbanBoard";
import NewDealModal from "@/components/pipeline/NewDealModal";
import { useState } from "react";

export default function DealsPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className="h-full flex flex-col space-y-4">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                        Embudo de Ventas
                    </h1>
                    <p className="text-gray-500 text-sm">Gestiona tus oportunidades en tiempo real</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="btn-primary shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
                >
                    <span className="text-xl">+</span> Nuevo Negocio
                </button>
            </div>

            <div className="flex-1 min-h-0">
                <KanbanBoard />
            </div>

            <NewDealModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </div>
    );
}
