"use client";
import React, { useState } from "react";
import { Trophy } from "lucide-react";

interface FirstDealStepProps {
    updateData: (data: { firstDeal: { title: string; value: string; probability: string } }) => void;
    onNext: () => void;
}

export default function FirstDealStep({ updateData, onNext }: FirstDealStepProps) {
    const [deal, setDeal] = useState({
        title: "",
        value: "",
        probability: "50", // Propuesta
    });

    const handleChange = (field: string, value: string) => {
        setDeal({ ...deal, [field]: value });
        updateData({ firstDeal: { ...deal, [field]: value } });
    };

    const isValid = deal.title.trim() !== "" && deal.value.trim() !== "";

    return (
        <div className="space-y-8 animate-fadeIn">
            <div className="text-center">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce-short">
                    <Trophy size={32} className="text-yellow-600" />
                </div>
                <h1 className="text-2xl font-bold text-gray-800 mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    ¡Tu Primera Victoria! 🏆
                </h1>
                <p className="text-gray-500 max-w-md mx-auto">
                    Para que el tablero funcione, necesitas un negocio activo.
                    Piensa en una oportunidad real que tengas ahora mismo.
                </p>
            </div>

            <div className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-2xl border border-gray-200 shadow-sm max-w-lg mx-auto transform transition-all hover:scale-[1.01] hover:shadow-md">
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Nombre del Negocio</label>
                        <input
                            type="text"
                            placeholder="Ej. Contrato Anual Cliente X"
                            value={deal.title}
                            onChange={(e) => handleChange("title", e.target.value)}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#00AEEF] outline-none text-gray-800 font-medium"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Valor Estimado</label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold">$</span>
                                <input
                                    type="number"
                                    placeholder="0.00"
                                    value={deal.value}
                                    onChange={(e) => handleChange("value", e.target.value)}
                                    className="w-full pl-8 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#00AEEF] outline-none text-gray-800 font-medium"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Etapa Inicial</label>
                            <select
                                value={deal.probability}
                                onChange={(e) => handleChange("probability", e.target.value)}
                                className="w-full px-3 py-3 border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-[#00AEEF] outline-none font-medium text-sm"
                            >
                                <option value="20">Prospecto (20%)</option>
                                <option value="50">Propuesta (50%)</option>
                                <option value="80">Negociación (80%)</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            <div className="pt-2">
                <button
                    onClick={onNext}
                    disabled={!isValid}
                    className={`
                w-full py-4 rounded-xl font-bold text-lg shadow-lg flex items-center justify-center gap-2 transition-all
                ${isValid
                            ? "bg-gradient-to-r from-[#00AEEF] to-[#004A8D] text-white hover:shadow-xl hover:-translate-y-1 cursor-pointer"
                            : "bg-gray-200 text-gray-400 cursor-not-allowed"}
            `}
                >
                    ¡Lanzar mi CRM! 🚀
                </button>
            </div>
        </div>
    );
}
