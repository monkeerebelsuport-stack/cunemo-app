"use client";

import { Check, Zap, Shield } from "lucide-react";

const plans = [
    {
        name: "Starter",
        price: "29",
        description: "Ideal para emprendedores y autónomos.",
        features: ["Hasta 500 contactos", "2 Usuarios", "Pipeline Personalizado", "Soporte vía Email"],
        color: "text-gray-600",
        buttonText: "Plan Actual",
        isCurrent: true
    },
    {
        name: "Pro Professional",
        price: "79",
        description: "Para equipos que buscan escalar sus ventas.",
        features: ["Contactos Ilimitados", "10 Usuarios", "Automatización de Tareas", "Integración con WhatsApp", "Reportes Avanzados"],
        color: "text-[#00AEEF]",
        buttonText: "Subir a Pro",
        isCurrent: false,
        recommended: true
    },
    {
        name: "Enterprise",
        price: "199",
        description: "Seguridad y control total para grandes empresas.",
        features: ["Todo lo de Pro", "Usuarios Ilimitados", "API Dedicada", "Soporte 24/7 VIP", "Onboarding Directo"],
        color: "text-[#004A8D]",
        buttonText: "Contactar Ventas",
        isCurrent: false
    }
];

export default function BillingPage() {
    return (
        <div className="space-y-10 animate-fadeIn">
            <div className="text-center max-w-2xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-800 mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    Mi Plan y Facturación 💳
                </h1>
                <p className="text-gray-500">
                    Gestiona tu suscripción y descubre herramientas avanzadas para llevar tu negocio al siguiente nivel.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {plans.map((plan) => (
                    <div
                        key={plan.name}
                        className={`
                            relative bg-white rounded-3xl p-8 border transition-all duration-300
                            ${plan.recommended ? "border-[#00AEEF] shadow-xl scale-105 z-10" : "border-gray-100 shadow-sm hover:shadow-md"}
                        `}
                    >
                        {plan.recommended && (
                            <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#00AEEF] text-white text-[10px] font-bold px-4 py-1.5 rounded-full shadow-lg">
                                RECOMENDADO
                            </span>
                        )}

                        <div className="mb-8">
                            <h3 className={`text-xl font-bold mb-2 ${plan.color}`}>{plan.name}</h3>
                            <div className="flex items-baseline gap-1">
                                <span className="text-4xl font-black text-gray-800">${plan.price}</span>
                                <span className="text-gray-400 text-sm">/ mes</span>
                            </div>
                            <p className="text-gray-500 text-sm mt-4">{plan.description}</p>
                        </div>

                        <ul className="space-y-4 mb-8">
                            {plan.features.map((feature) => (
                                <li key={feature} className="flex items-center gap-3 text-sm text-gray-600">
                                    <div className={`p-1 rounded-full ${plan.recommended ? "bg-blue-50 text-[#00AEEF]" : "bg-gray-50 text-gray-400"}`}>
                                        <Check size={12} />
                                    </div>
                                    {feature}
                                </li>
                            ))}
                        </ul>

                        <button
                            className={`
                                w-full py-3 rounded-xl font-bold text-sm transition-all
                                ${plan.isCurrent
                                    ? "bg-gray-100 text-gray-400 cursor-default"
                                    : plan.recommended
                                        ? "bg-gradient-to-r from-[#004A8D] to-[#00AEEF] text-white hover:opacity-90 shadow-lg shadow-blue-500/20"
                                        : "border-2 border-[#004A8D] text-[#004A8D] hover:bg-blue-50"
                                }
                            `}
                        >
                            {plan.buttonText}
                        </button>
                    </div>
                ))}
            </div>

            {/* Extra Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
                <div className="flex items-start gap-4 p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                        <Zap size={24} />
                    </div>
                    <div>
                        <h4 className="font-bold text-gray-800">Actualización Instantánea</h4>
                        <p className="text-sm text-gray-500 mt-1">Los cambios de plan se aplican de inmediato y prorrateamos la diferencia.</p>
                    </div>
                </div>
                <div className="flex items-start gap-4 p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
                    <div className="p-3 bg-green-50 text-green-600 rounded-xl">
                        <Shield size={24} />
                    </div>
                    <div>
                        <h4 className="font-bold text-gray-800">Seguridad Bancaria</h4>
                        <p className="text-sm text-gray-500 mt-1">Tus pagos se procesan de forma segura a través de Stripe con cifrado de 256 bits.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
