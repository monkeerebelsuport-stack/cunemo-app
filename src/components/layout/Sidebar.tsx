"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Users, Briefcase, Calendar, Settings, LogOut, Building, MessageSquare, Plug, CreditCard } from "lucide-react";
import { supabase } from "@/lib/supabase";

const menuSections = [
    {
        title: "DASHBOARD",
        items: [
            { icon: LayoutDashboard, label: "Resumen", href: "/dashboard" },
        ]
    },
    {
        title: "VENTAS",
        items: [
            { icon: Briefcase, label: "Pipeline", href: "/dashboard/deals" },
            { icon: Users, label: "Contactos", href: "/dashboard/contacts" },
            { icon: Building, label: "Empresas", href: "/dashboard/companies" }, // Placeholder / Future
        ]
    },
    {
        title: "PRODUCTIVIDAD",
        items: [
            { icon: Calendar, label: "Actividades", href: "/dashboard/activities" },
            { icon: MessageSquare, label: "Tickets", href: "/dashboard/tickets" }, // New Section
        ]
    },
    {
        title: "CONFIGURACIÓN",
        items: [
            { icon: Plug, label: "Integraciones", href: "/dashboard/integrations" },
            { icon: CreditCard, label: "Mi Plan", href: "/dashboard/billing" },
            { icon: Settings, label: "Ajustes", href: "/dashboard/settings" },
        ]
    }
];

export default function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = async () => {
        const { error } = await supabase.auth.signOut();
        if (!error) {
            router.push("/login");
        }
    };

    return (
        <aside className="w-64 bg-white border-r border-gray-200 flex flex-col h-full shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-20">
            <div className="p-6 border-b border-gray-50 flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-[#004A8D] to-[#00AEEF] rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-blue-500/20">
                    C
                </div>
                <h1 className="text-xl font-bold text-[#004A8D]" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    Cunemo<span className="text-[#00AEEF]">Client</span>
                </h1>
            </div>

            <nav className="flex-1 p-4 space-y-6 overflow-y-auto custom-scrollbar">
                {menuSections.map((section) => (
                    <div key={section.title} className="space-y-1">
                        <h3 className="px-4 text-[10px] font-bold text-gray-400 tracking-wider uppercase mb-2">
                            {section.title}
                        </h3>
                        {section.items.map((item) => {
                            const isActive = pathname === item.href;
                            const Icon = item.icon;

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    id={item.label === "Pipeline" ? "nav-pipeline" : undefined}
                                    className={`
                                        relative flex items-center gap-3 px-4 py-2.5 rounded-xl font-medium transition-all duration-200 group
                                        ${isActive
                                            ? "text-white shadow-md shadow-blue-500/20"
                                            : "text-gray-500 hover:bg-gray-50 hover:text-[#004A8D]"
                                        }
                                    `}
                                >
                                    {isActive && (
                                        <div className="absolute inset-0 bg-gradient-to-r from-[#004A8D] to-[#00AEEF] rounded-xl -z-10 animate-fadeIn" />
                                    )}
                                    <Icon size={18} className={`transition-colors ${isActive ? "text-white" : "text-gray-400 group-hover:text-[#004A8D]"}`} />
                                    <span className="text-sm">{item.label}</span>
                                </Link>
                            );
                        })}
                    </div>
                ))}
            </nav>

            <div className="p-4 border-t border-gray-50">
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-4 py-3 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all duration-200 group font-medium text-sm"
                >
                    <LogOut size={18} className="group-hover:rotate-12 transition-transform" />
                    <span>Cerrar Sesión</span>
                </button>
            </div>
        </aside>
    );
}
