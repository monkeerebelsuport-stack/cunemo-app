"use client";

import { useState, useEffect } from "react";
import Modal from "@/components/ui/Modal";
import { useDeal } from "@/hooks/useDeal";
import { ActivityType } from "@/types/pipeline";
import { Phone, Mail, FileText, Calendar } from "lucide-react";

interface ActivityModalProps {
    isOpen: boolean;
    onClose: () => void;
    dealId: string;
    initialType?: ActivityType;
}

export default function ActivityModal({ isOpen, onClose, dealId, initialType = "call" }: ActivityModalProps) {
    const { addActivity } = useDeal();
    const [loading, setLoading] = useState(false);
    const [type, setType] = useState<ActivityType>(initialType);
    const [subject, setSubject] = useState("");
    const [notes, setNotes] = useState("");

    // Sincronizar el tipo interno cuando la prop initialType cambia
    useEffect(() => {
        setType(initialType);
    }, [initialType, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!subject) return;

        setLoading(true);
        try {
            await addActivity({
                deal_id: dealId,
                type,
                subject,
                notes
            });
            onClose();
            setSubject("");
            setNotes("");
        } catch (error) {
            console.error(error);
            alert("Error al guardar actividad");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Registrar Actividad">
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Type Selector */}
                <div className="flex gap-2 mb-4">
                    <button
                        type="button"
                        onClick={() => setType("call")}
                        className={`flex-1 flex flex-col items-center gap-1 p-2 rounded-lg border ${type === "call" ? "bg-blue-50 border-blue-500 text-blue-600" : "border-gray-200 text-gray-500"}`}
                    >
                        <Phone size={18} /> <span className="text-xs">Llamada</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => setType("email")}
                        className={`flex-1 flex flex-col items-center gap-1 p-2 rounded-lg border ${type === "email" ? "bg-blue-50 border-blue-500 text-blue-600" : "border-gray-200 text-gray-500"}`}
                    >
                        <Mail size={18} /> <span className="text-xs">Email</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => setType("note")}
                        className={`flex-1 flex flex-col items-center gap-1 p-2 rounded-lg border ${type === "note" ? "bg-blue-50 border-blue-500 text-blue-600" : "border-gray-200 text-gray-500"}`}
                    >
                        <FileText size={18} /> <span className="text-xs">Nota</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => setType("meeting")}
                        className={`flex-1 flex flex-col items-center gap-1 p-2 rounded-lg border ${type === "meeting" ? "bg-blue-50 border-blue-500 text-blue-600" : "border-gray-200 text-gray-500"}`}
                    >
                        <Calendar size={18} /> <span className="text-xs">Reunión</span>
                    </button>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Asunto</label>
                    <input
                        type="text"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        placeholder={type === "call" ? "Llamada con cliente..." : type === "email" ? "Envío de propuesta..." : "Resumen de la reunión..."}
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00AEEF]/20 focus:border-[#00AEEF]"
                        autoFocus
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Notas (Opcional)</label>
                    <textarea
                        rows={3}
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00AEEF]/20 focus:border-[#00AEEF]"
                    />
                </div>

                <div className="flex justify-end pt-2">
                    <button
                        type="submit"
                        disabled={loading || !subject}
                        className="bg-[#00AEEF] hover:bg-[#009bd6] text-white px-6 py-2 rounded-lg font-semibold shadow-md shadow-blue-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? "Guardando..." : "Guardar Actividad"}
                    </button>
                </div>
            </form>
        </Modal>
    );
}
