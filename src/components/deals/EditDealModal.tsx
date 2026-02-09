"use client";

import { useState, useEffect } from "react";
import Modal from "@/components/ui/Modal";
import { useDeal } from "@/hooks/useDeal";
import { Deal } from "@/types/pipeline";

interface EditDealModalProps {
    isOpen: boolean;
    onClose: () => void;
    deal: Deal;
}

export default function EditDealModal({ isOpen, onClose, deal }: EditDealModalProps) {
    const { updateDeal } = useDeal();
    const [loading, setLoading] = useState(false);

    // Form fields
    const [title, setTitle] = useState(deal.title);
    const [value, setValue] = useState(deal.value.toString());
    const [probability, setProbability] = useState(deal.probability.toString());
    const [expectedCloseDate, setExpectedCloseDate] = useState(deal.expectedCloseDate || "");

    useEffect(() => {
        if (isOpen) {
            setTitle(deal.title);
            setValue(deal.value.toString());
            setProbability(deal.probability.toString());
            setExpectedCloseDate(deal.expectedCloseDate || "");
        }
    }, [isOpen, deal]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        setLoading(true);
        try {
            await updateDeal(deal.id, {
                name: title,
                value: parseFloat(value),
                probability: parseInt(probability),
                expected_close_date: expectedCloseDate || undefined
            });
            onClose();
        } catch (error) {
            console.error(error);
            alert("Error al actualizar el negocio");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Editar Detalles del Negocio">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del Negocio</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00AEEF]/20 focus:border-[#00AEEF]"
                        required
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Valor ($)</label>
                        <input
                            type="number"
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00AEEF]/20 focus:border-[#00AEEF]"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Probabilidad (%)</label>
                        <input
                            type="number"
                            min="0"
                            max="100"
                            value={probability}
                            onChange={(e) => setProbability(e.target.value)}
                            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00AEEF]/20 focus:border-[#00AEEF]"
                            required
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Cierre Esperado</label>
                    <input
                        type="date"
                        value={expectedCloseDate}
                        onChange={(e) => setExpectedCloseDate(e.target.value)}
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00AEEF]/20 focus:border-[#00AEEF]"
                    />
                </div>

                <div className="flex justify-end pt-2">
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-[#00AEEF] hover:bg-[#009bd6] text-white px-6 py-2 rounded-lg font-semibold shadow-md shadow-blue-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? "Guardando..." : "Guardar Cambios"}
                    </button>
                </div>
            </form>
        </Modal>
    );
}
