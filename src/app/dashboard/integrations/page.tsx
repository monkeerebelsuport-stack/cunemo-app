"use client";

import { useState } from "react";
import { Plug, MessageSquare, Mail, Calendar, CreditCard, ChevronRight } from "lucide-react";
import WhatsAppIntegration from "@/components/integrations/WhatsAppIntegration";
import ComingSoonIntegration from "@/components/integrations/ComingSoonIntegration";
import EmailIntegration from "@/components/integrations/EmailIntegration";
import GoogleCalendarIntegration from "@/components/integrations/GoogleCalendarIntegration";

const integrationsList = [
    {
        id: "whatsapp",
        name: "WhatsApp API",
        description: "Envía mensajes automáticos y centraliza tu chat de ventas.",
        icon: MessageSquare,
        color: "text-green-500",
        bgColor: "bg-green-50",
        status: "activo",
        features: ["Multi-agente", "Bots de respuesta", "Cifrado Meta"]
    },
    {
        id: "gmail",
        name: "Email (Resend API)",
        description: "Envía correos directos a tus clientes desde el CRM con alta entregabilidad.",
        icon: Mail,
        color: "text-blue-500",
        bgColor: "bg-blue-50",
        status: "activo",
        features: ["Envío directo", "Seguimiento de entrega", "Filtro Anti-Spam"]
    },
    {
        id: "calendar",
        name: "Google Calendar",
        description: "Agenda reuniones directamente desde el pipeline de ventas.",
        icon: Calendar,
        color: "text-orange-500",
        bgColor: "bg-orange-50",
        status: "activo",
        features: ["Citas en Pipeline", "Recordatorios SMS", "Múltiples zonas horarias"]
    },
    {
        id: "stripe",
        name: "Stripe",
        description: "Genera facturas y procesa pagos al cerrar un negocio GANADO.",
        icon: CreditCard,
        color: "text-purple-500",
        bgColor: "bg-purple-50",
        status: "activo",
        features: ["Facturación Automática", "Links de Cobro", "Analítica de Ingresos"]
    }
];

export default function IntegrationsPage() {
    const [selectedId, setSelectedId] = useState<string | null>(null);

    const activeIntegration = integrationsList.find(i => i.id === selectedId);

    if (selectedId === "whatsapp") {
        return <WhatsAppIntegration onBack={() => setSelectedId(null)} />;
    }

    if (selectedId === "gmail") {
        return <EmailIntegration onBack={() => setSelectedId(null)} />;
    }

    if (selectedId === "calendar") {
        return <GoogleCalendarIntegration onBack={() => setSelectedId(null)} />;
    }

    if (selectedId && activeIntegration) {
        return (
            <ComingSoonIntegration
                name={activeIntegration.name}
                icon={activeIntegration.icon}
                color={activeIntegration.color}
                features={activeIntegration.features}
                onBack={() => setSelectedId(null)}
            />
        );
    }

    return (
        <div className="space-y-8 animate-fadeIn">
            <div>
                <h1 className="text-3xl font-bold text-gray-800" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    Integraciones 🔌
                </h1>
                <p className="text-gray-500 mt-2">
                    Conecta CunemoClient con las herramientas que ya usas para automatizar tu flujo de trabajo.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {integrationsList.map((int) => (
                    <div
                        key={int.id}
                        className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group relative overflow-hidden flex flex-col h-full"
                    >
                        <div className="flex items-start justify-between">
                            <div className={`${int.bgColor} ${int.color} p-4 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300`}>
                                <int.icon size={28} />
                            </div>
                            <span className="text-[10px] uppercase font-black px-3 py-1 rounded-full bg-green-100 text-green-600">
                                {int.status === 'activo' ? 'Activo' : 'Casi listo'}
                            </span>
                        </div>

                        <h3 className="text-xl font-bold text-gray-800 mb-2">{int.name}</h3>
                        <p className="text-sm text-gray-500 mb-6 leading-relaxed flex-1">
                            {int.description}
                        </p>

                        <button
                            onClick={() => setSelectedId(int.id)}
                            className="flex items-center gap-2 text-sm font-semibold transition-all text-[#00AEEF] hover:gap-3"
                        >
                            Configurar ahora <ChevronRight size={16} />
                        </button>

                        {/* Abstract Deco */}
                        <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-gray-50 rounded-full group-hover:bg-blue-50 transition-colors -z-10" />
                    </div>
                ))}
            </div>

            <div className="bg-[#004A8D] text-white p-8 rounded-3xl relative overflow-hidden">
                <div className="relative z-10 max-w-lg">
                    <h2 className="text-2xl font-bold mb-4">¿Necesitas una integración personalizada?</h2>
                    <p className="opacity-80 text-sm mb-6">
                        Nuestro equipo puede ayudarte a conectar CunemoClient con cualquier herramienta mediante Webhooks y nuestra API privada.
                    </p>
                    <button className="bg-white text-[#004A8D] px-6 py-3 rounded-xl font-bold text-sm hover:bg-white/90 transition-colors">
                        Hablar con soporte
                    </button>
                </div>
                <Plug size={120} className="absolute -right-8 -bottom-8 opacity-10 rotate-12" />
            </div>
        </div>
    );
}
