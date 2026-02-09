"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Mail, AlertTriangle, Briefcase, LayoutDashboard, Loader2, Save, LucideIcon } from "lucide-react";

export default function NotificationSettings() {
    const [loading, setLoading] = useState(false);
    const [saved, setSaved] = useState(false);
    const [prefs, setPrefs] = useState({
        email_alerts: true,
        platform_alerts: true,
        risk_notifications: true,
        task_reminders: true,
        weekly_summary: false
    });

    useEffect(() => {
        async function getPrefs() {
            const { data: { user } } = await supabase.auth.getUser();
            if (user?.user_metadata?.notification_prefs) {
                setPrefs(user.user_metadata.notification_prefs);
            }
        }
        getPrefs();
    }, []);

    const handleSave = async () => {
        setLoading(true);
        try {
            const { error } = await supabase.auth.updateUser({
                data: { notification_prefs: prefs }
            });

            if (error) throw error;
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        } catch (error) {
            if (error instanceof Error) {
                alert(error.message);
            }
        } finally {
            setLoading(false);
        }
    };

    const toggle = (key: keyof typeof prefs) => {
        setPrefs(prev => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <div className="max-w-2xl animate-fadeIn space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Canales */}
                <div className="space-y-4">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                        Canales de Envío
                    </h4>
                    <div className="space-y-3">
                        <PreferenceCard
                            icon={Mail}
                            title="Correo Electrónico"
                            desc="Recibe alertas en tu bandeja de entrada."
                            active={prefs.email_alerts}
                            onToggle={() => toggle('email_alerts')}
                        />
                        <PreferenceCard
                            icon={LayoutDashboard}
                            title="Alertas en Plataforma"
                            desc="Notificaciones visuales dentro del CRM."
                            active={prefs.platform_alerts}
                            onToggle={() => toggle('platform_alerts')}
                        />
                    </div>
                </div>

                {/* Tipos de Alerta */}
                <div className="space-y-4">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                        Eventos Críticos
                    </h4>
                    <div className="space-y-3">
                        <PreferenceCard
                            icon={AlertTriangle}
                            title="Riesgos de Negocio"
                            desc="Cuando un deal entra en zona fría."
                            active={prefs.risk_notifications}
                            onToggle={() => toggle('risk_notifications')}
                            color="text-red-500"
                        />
                        <PreferenceCard
                            icon={Briefcase}
                            title="Tareas y Seguimientos"
                            desc="Recordatorios de tus actividades diarias."
                            active={prefs.task_reminders}
                            onToggle={() => toggle('task_reminders')}
                            color="text-[#00AEEF]"
                        />
                    </div>
                </div>
            </div>

            <div className="pt-8 border-t border-gray-50 flex items-center justify-between">
                <p className="text-xs text-gray-400 italic">
                    Las notificaciones push para dispositivos móviles estarán disponibles próximamente.
                </p>
                <button
                    onClick={handleSave}
                    disabled={loading}
                    className="btn-primary min-w-[160px] shadow-lg shadow-blue-500/20"
                >
                    {loading ? (
                        <Loader2 className="animate-spin" size={18} />
                    ) : (
                        <span className="flex items-center gap-2">
                            {saved ? "¡Guardado!" : <><Save size={18} /> Guardar Preferencias</>}
                        </span>
                    )}
                </button>
            </div>
        </div>
    );
}

interface PreferenceCardProps {
    icon: LucideIcon;
    title: string;
    desc: string;
    active: boolean;
    onToggle: () => void;
    color?: string;
}

function PreferenceCard({ icon: Icon, title, desc, active, onToggle, color }: PreferenceCardProps) {
    return (
        <div
            onClick={onToggle}
            className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between group ${active ? 'bg-white border-blue-100 shadow-sm' : 'bg-gray-50/50 border-gray-100 grayscale'}`}
        >
            <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl transition-colors ${active ? (color || 'text-blue-600') + ' bg-blue-50' : 'bg-white text-gray-400'}`}>
                    <Icon size={18} />
                </div>
                <div>
                    <h5 className="text-sm font-bold text-gray-800">{title}</h5>
                    <p className="text-[10px] text-gray-500 leading-tight mt-0.5">{desc}</p>
                </div>
            </div>
            <div className={`w-10 h-5 rounded-full transition-all relative ${active ? 'bg-[#00AEEF]' : 'bg-gray-200'}`}>
                <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${active ? 'left-6' : 'left-1'}`} />
            </div>
        </div>
    );
}
