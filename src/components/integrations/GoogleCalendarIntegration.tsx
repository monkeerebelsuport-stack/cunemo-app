"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Calendar, CheckCircle2, AlertCircle, Loader2, Unplug, ExternalLink } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface GoogleCalendarIntegrationProps {
    onBack: () => void;
}

export default function GoogleCalendarIntegration({ onBack }: GoogleCalendarIntegrationProps) {
    const [status, setStatus] = useState<'idle' | 'loading' | 'connected' | 'error'>('idle');
    const [isConnecting, setIsConnecting] = useState(false);

    useEffect(() => {
        checkIntegrationStatus();

        // Revisar si venimos de un callback exitoso
        const params = new URLSearchParams(window.location.search);
        if (params.get('success') === 'google') {
            setStatus('connected');
        } else if (params.get('error')) {
            setStatus('error');
        }
    }, []);

    const checkIntegrationStatus = async () => {
        setStatus('loading');
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) return;

            const { data } = await supabase
                .from('integrations')
                .select('*')
                .eq('user_id', session.user.id)
                .eq('provider', 'google_calendar')
                .single();

            if (data) {
                setStatus('connected');
            } else {
                setStatus('idle');
            }
        } catch (err) {
            console.error("Error checking status:", err);
            setStatus('error');
        }
    };

    const handleConnect = () => {
        setIsConnecting(true);
        // Redirigir a nuestra API de Auth
        window.location.href = '/api/integrations/google-calendar/auth';
    };

    const handleDisconnect = async () => {
        if (!confirm("¿Estás seguro de desconectar tu Google Calendar? Se detendrá la sincronización de citas.")) return;

        setStatus('loading');
        try {
            const { data: { session } } = await supabase.auth.getSession();
            await supabase
                .from('integrations')
                .delete()
                .eq('user_id', session?.user?.id)
                .eq('provider', 'google_calendar');

            setStatus('idle');
        } catch (err) {
            console.error("Error disconnecting:", err);
            setStatus('error');
        }
    };

    return (
        <div className="space-y-8 animate-fadeIn">
            {/* Header */}
            <div className="flex items-center gap-4">
                <button
                    onClick={onBack}
                    className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-400 hover:text-gray-600"
                >
                    <ArrowLeft size={20} />
                </button>
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Google Calendar</h2>
                    <p className="text-sm text-gray-500">Sincroniza tus citas de ventas con tu agenda personal.</p>
                </div>
            </div>

            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-12">
                    <div className="max-w-2xl mx-auto text-center space-y-8">
                        <div className={`w-24 h-24 mx-auto rounded-3xl flex items-center justify-center bg-orange-50 text-orange-500 shadow-inner`}>
                            <Calendar size={48} />
                        </div>

                        {status === 'connected' ? (
                            <div className="space-y-6">
                                <div className="inline-flex items-center gap-2 bg-green-50 text-green-600 text-xs font-bold px-4 py-2 rounded-full">
                                    <CheckCircle2 size={16} /> Conectado Correctamente
                                </div>
                                <h3 className="text-3xl font-bold text-gray-800">Tu agenda está sincronizada</h3>
                                <p className="text-sm text-gray-500 leading-relaxed">
                                    Ahora las reuniones que agendes con tus clientes en el CRM aparecerán automáticamente en tu Google Calendar y viceversa.
                                </p>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                                    <div className="p-4 bg-gray-50 rounded-2xl text-left">
                                        <div className="text-[10px] font-black uppercase text-gray-400 mb-1">Cuenta Vinculada</div>
                                        <div className="text-sm font-semibold text-gray-700">Tu cuenta principal de Google</div>
                                    </div>
                                    <div className="p-4 bg-gray-50 rounded-2xl text-left">
                                        <div className="text-[10px] font-black uppercase text-gray-400 mb-1">Estado Sincro</div>
                                        <div className="text-sm font-semibold text-green-600">Activo y Protegido</div>
                                    </div>
                                </div>

                                <button
                                    onClick={handleDisconnect}
                                    className="pt-8 text-gray-400 hover:text-red-500 text-xs font-bold flex items-center justify-center gap-2 mx-auto transition-colors"
                                >
                                    <Unplug size={14} /> Desconectar integración
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                <h3 className="text-3xl font-bold text-gray-800">Conecta tu Calendario</h3>
                                <p className="text-sm text-gray-500 leading-relaxed">
                                    Para que Anderson CRM pueda agendar citas con tus clientes, necesitas vincular tu cuenta de Google Calendar. Esto te permitirá tener una vista 360° de tus compromisos.
                                </p>

                                <div className="space-y-4 pt-4">
                                    <div className="flex items-start gap-3 text-left p-4 bg-blue-50/50 rounded-2xl border border-blue-50">
                                        <CheckCircle2 size={18} className="text-blue-500 mt-1" />
                                        <div>
                                            <div className="text-sm font-bold text-blue-900">Privacidad Total</div>
                                            <div className="text-xs text-blue-700/70">Solo accedemos a tus eventos del CRM. No leemos tus correos ni datos privados.</div>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={handleConnect}
                                    disabled={isConnecting || status === 'loading'}
                                    className="w-full py-4 bg-[#4285F4] text-white font-bold rounded-2xl flex items-center justify-center gap-3 hover:bg-[#357abd] transition-all shadow-lg shadow-blue-200 disabled:opacity-50"
                                >
                                    {isConnecting || status === 'loading' ? (
                                        <Loader2 size={20} className="animate-spin" />
                                    ) : (
                                        <>
                                            <ExternalLink size={20} /> Conectar con Google Calendar
                                        </>
                                    )}
                                </button>

                                <p className="text-[10px] text-gray-400">
                                    Al conectar, aceptas los términos de servicio de integración SaaS de CunemoClient.
                                </p>
                            </div>
                        )}

                        {status === 'error' && (
                            <div className="p-4 bg-red-50 text-red-600 rounded-2xl flex items-center gap-3 text-sm font-medium">
                                <AlertCircle size={20} />
                                Hubo un problema al conectar. Por favor intenta de nuevo.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
