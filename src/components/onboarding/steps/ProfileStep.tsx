"use client";
import React from "react";
import { Briefcase, Building, Coins } from "lucide-react";

interface ProfileStepProps {
    data: { role: string; industry: string; currency: string };
    updateData: (data: Partial<{ role: string; industry: string; currency: string }>) => void;
    onNext: () => void;
}

export default function ProfileStep({ data, updateData, onNext }: ProfileStepProps) {

    const handleChange = (field: string, value: string) => {
        updateData({ [field]: value });
    };

    const isFormValid = data.role && data.industry && data.currency;

    return (
        <div className="space-y-6">
            <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-gray-800 mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    Personalicemos tu experiencia 🎨
                </h1>
                <p className="text-gray-500">
                    Ayúdanos a configurar tu CRM para que hable tu mismo idioma.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {/* Role Selection */}
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <Briefcase size={16} className="text-[#00AEEF]" /> ¿Cuál es tu rol principal?
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                        {["CEO / Dueño", "Gerente de Ventas", "Vendedor"].map((role) => (
                            <button
                                key={role}
                                onClick={() => handleChange("role", role)}
                                className={`
                            px-4 py-3 rounded-xl border text-sm font-medium transition-all
                            ${data.role === role
                                        ? "border-[#00AEEF] bg-blue-50 text-[#004A8D] shadow-sm transform scale-[1.02]"
                                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-600"}
                        `}
                            >
                                {role}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Industry */}
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <Building size={16} className="text-[#00AEEF]" /> ¿En qué industria estás?
                    </label>
                    <select
                        value={data.industry}
                        onChange={(e) => handleChange("industry", e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#00AEEF] focus:border-transparent outline-none bg-white font-medium text-gray-700"
                    >
                        <option value="" disabled>Selecciona una industria</option>
                        <option value="tech">Tecnología / Software</option>
                        <option value="real_estate">Bienes Raíces</option>
                        <option value="consulting">Consultoría / Servicios</option>
                        <option value="manufacturing">Manufactura</option>
                        <option value="retail">Retail / Comercio</option>
                        <option value="other">Otro</option>
                    </select>
                </div>

                {/* Currency */}
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <Coins size={16} className="text-[#00AEEF]" /> Tu moneda principal
                    </label>
                    <div className="flex gap-4">
                        {["USD", "EUR", "MXN"].map((curr) => (
                            <button
                                key={curr}
                                onClick={() => handleChange("currency", curr)}
                                className={`
                            flex-1 px-4 py-3 rounded-xl border text-sm font-bold transition-all
                            ${data.currency === curr
                                        ? "border-[#8DC63F] bg-green-50 text-[#004A8D] shadow-sm ring-1 ring-[#8DC63F]"
                                        : "border-gray-200 hover:border-gray-300 text-gray-500"}
                        `}
                            >
                                {curr}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="pt-6">
                <button
                    onClick={onNext}
                    disabled={!isFormValid}
                    className={`
                w-full py-4 rounded-xl font-bold text-lg shadow-lg flex items-center justify-center gap-2 transition-all
                ${isFormValid
                            ? "bg-gradient-to-r from-[#004A8D] to-[#00AEEF] text-white hover:shadow-xl hover:-translate-y-1 cursor-pointer"
                            : "bg-gray-200 text-gray-400 cursor-not-allowed"}
            `}
                >
                    Continuar ➔
                </button>
            </div>
        </div>
    );
}
