"use client";

import { useState } from "react";
import { Settings, User, Shield, Bell, Database, ChevronLeft, LucideIcon } from "lucide-react";
import ProfileSettings from "@/components/settings/ProfileSettings";
import PipelineSettings from "@/components/settings/PipelineSettings";
import SecuritySettings from "@/components/settings/SecuritySettings";
import NotificationSettings from "@/components/settings/NotificationSettings";

type SettingView = "main" | "profile" | "security" | "notifications" | "pipeline";

interface SettingSection {
    id: SettingView;
    icon: LucideIcon;
    title: string;
    desc: string;
    status: "Activo" | "Próximamente";
}

export default function SettingsPage() {
    const [activeView, setActiveView] = useState<SettingView>("main");

    const sections: SettingSection[] = [
        { id: "profile", icon: User, title: "Perfil de Usuario", desc: "Gestiona tu información personal y avatar.", status: "Activo" },
        { id: "pipeline", icon: Database, title: "Datos & Pipeline", desc: "Personaliza las etapas de tu embudo de ventas.", status: "Activo" },
        { id: "security", icon: Shield, title: "Seguridad & Acceso", desc: "Cambia tu contraseña y protege tu cuenta.", status: "Activo" },
        { id: "notifications", icon: Bell, title: "Notificaciones", desc: "Configura qué alertas quieres recibir.", status: "Activo" },
    ];

    if (activeView !== "main") {
        const viewConfigs = {
            profile: { title: "Perfil de Usuario 👤", desc: "Personaliza cómo te ven tus colegas y clientes.", component: <ProfileSettings /> },
            security: { title: "Seguridad & Acceso 🔐", desc: "Gestiona tu contraseña y la seguridad de tu cuenta.", component: <SecuritySettings /> },
            notifications: { title: "Notificaciones 🔔", desc: "Configura cómo quieres ser alertado por el sistema.", component: <NotificationSettings /> },
            pipeline: { title: "Datos & Pipeline 📊", desc: "Gestiona la columna vertebral de tu proceso comercial.", component: <PipelineSettings /> },
        };

        const current = viewConfigs[activeView as keyof typeof viewConfigs];

        return (
            <div className="space-y-8 animate-fadeIn">
                <button
                    onClick={() => setActiveView("main")}
                    className="flex items-center gap-2 text-gray-400 hover:text-[#00AEEF] transition-colors text-sm font-bold group"
                >
                    <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                    Volver a Ajustes
                </button>
                <div>
                    <h1 className="text-3xl font-bold text-gray-800" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                        {current.title}
                    </h1>
                    <p className="text-gray-500 mt-2">{current.desc}</p>
                </div>
                <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                    {current.component}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-fadeIn">
            <div>
                <h1 className="text-3xl font-bold text-gray-800" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    Configuración ⚙️
                </h1>
                <p className="text-gray-500 mt-2">Personaliza CunemoClient para que se adapte a tu forma de trabajar.</p>
            </div>

            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="divide-y divide-gray-50">
                    {sections.map((s) => (
                        <div
                            key={s.id}
                            onClick={() => s.status === "Activo" && setActiveView(s.id)}
                            className={`p-6 flex items-center justify-between transition-colors group ${s.status === "Activo" ? "hover:bg-gray-50 cursor-pointer" : "opacity-60 cursor-not-allowed"}`}
                        >
                            <div className="flex items-center gap-4">
                                <div className={`p-3 rounded-xl transition-colors ${s.status === "Activo" ? "bg-gray-50 text-gray-400 group-hover:bg-blue-50 group-hover:text-[#00AEEF]" : "bg-gray-50 text-gray-300"}`}>
                                    <s.icon size={20} />
                                </div>
                                <div>
                                    <h4 className={`font-bold text-sm transition-colors ${s.status === "Activo" ? "text-gray-800 group-hover:text-[#004A8D]" : "text-gray-400"}`}>{s.title}</h4>
                                    <p className="text-xs text-gray-500">{s.desc}</p>
                                </div>
                            </div>
                            <span className={`text-[10px] font-bold uppercase tracking-widest transition-colors ${s.status === 'Activo' ? 'text-[#00AEEF] group-hover:text-[#004A8D]' : 'text-gray-300'}`}>
                                {s.status === "Activo" ? "Gestionar" : "Próximamente"}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="p-6 bg-gradient-to-r from-gray-50 to-white rounded-2xl border border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Settings className="text-gray-300" size={20} />
                    <span className="text-sm text-gray-500 font-medium">Versión del Sistema: 1.2.0-Fase2</span>
                </div>
                <button className="text-[#00AEEF] text-xs font-bold hover:underline">Ver registro de cambios</button>
            </div>
        </div>
    );
}
