"use client";

import { useState, useEffect } from "react";
import { QrCode, Loader2, CheckCircle2, RefreshCw, Smartphone, Monitor, ShieldCheck, ArrowRight } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface WhatsAppQRProps {
    onSuccess: () => void;
}

export default function WhatsAppQR({ onSuccess }: WhatsAppQRProps) {
    const [qrUrl, setQrUrl] = useState<string | null>(null);
    const [status, setStatus] = useState<"loading" | "ready" | "connecting" | "success" | "error">("loading");
    const [timeLeft, setTimeLeft] = useState(60);

    useEffect(() => {
        generateInstance();

        // Simular polling para detectar conexión
        const interval = setInterval(checkStatus, 5000);
        return () => clearInterval(interval);
    }, []);

    const generateInstance = async () => {
        setStatus("loading");
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const res = await fetch("/api/integrations/whatsapp/instance", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId: user.id })
            });

            const data = await res.json();
            if (data.qr) {
                setQrUrl(data.qr);
                setStatus("ready");
                setTimeLeft(60);
            } else {
                setStatus("error");
            }
        } catch (err) {
            console.error(err);
            setStatus("error");
        }
    };

    const checkStatus = async () => {
        // En una implementación real, aquí consultaríamos el estado de la instancia en el servidor WA
        // Para el MVP simulamos éxito después de unos segundos si estamos en 'ready'
        if (status === "ready") {
            // Simulamos que el usuario escanea después de un tiempo
            // setStatus("success");
            // setTimeout(onSuccess, 2000);
        }
    };

    useEffect(() => {
        if (status === "ready" && timeLeft > 0) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timer);
        } else if (timeLeft === 0 && status === "ready") {
            setStatus("error"); // El QR expiró
        }
    }, [timeLeft, status]);

    return (
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-8 animate-fadeIn max-w-2xl mx-auto">
            <div className="flex flex-col md:flex-row gap-8 items-center">

                {/* QR Display Area */}
                <div className="relative group">
                    <div className={`
                        w-[250px] h-[250px] rounded-2xl border-2 flex items-center justify-center overflow-hidden transition-all duration-500
                        ${status === "success" ? "border-green-500 bg-green-50" : "border-gray-100 bg-gray-50"}
                    `}>
                        {status === "loading" && (
                            <div className="flex flex-col items-center gap-2">
                                <Loader2 className="animate-spin text-blue-500" size={32} />
                                <p className="text-[10px] font-bold text-gray-400">Generando instancia...</p>
                            </div>
                        )}

                        {status === "ready" && qrUrl && (
                            <div className="relative p-4 bg-white rounded-xl shadow-lg transform transition-transform group-hover:scale-105">
                                <img src={qrUrl} alt="WhatsApp QR" className="w-full h-full" />
                                <div className="absolute inset-0 border-4 border-blue-500/20 rounded-xl pointer-events-none"></div>
                            </div>
                        )}

                        {status === "error" && (
                            <div className="text-center p-6 space-y-4">
                                <div className="w-12 h-12 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto">
                                    <RefreshCw size={24} />
                                </div>
                                <p className="text-xs font-bold text-gray-500">El código expiró</p>
                                <button
                                    onClick={generateInstance}
                                    className="text-xs text-blue-600 font-bold underline"
                                >
                                    Generar nuevo código
                                </button>
                            </div>
                        )}

                        {status === "success" && (
                            <div className="text-center space-y-3 animate-bounce">
                                <CheckCircle2 size={64} className="text-green-500 mx-auto" />
                                <p className="text-sm font-bold text-green-600">¡Sincronizado!</p>
                            </div>
                        )}
                    </div>

                    {status === "ready" && (
                        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-lg">
                            Expira en {timeLeft}s
                        </div>
                    )}
                </div>

                {/* Instructions Area */}
                <div className="flex-1 space-y-6">
                    <div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">Conecta tu WhatsApp</h3>
                        <p className="text-sm text-gray-500 leading-relaxed">
                            Vincula Cunemo CRM con tu teléfono en segundos. Es seguro, privado y no requiere servidores externos.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-start gap-3">
                            <div className="w-6 h-6 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold shrink-0">1</div>
                            <p className="text-xs text-gray-600 pt-1">Abre **WhatsApp** en tu teléfono.</p>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="w-6 h-6 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold shrink-0">2</div>
                            <p className="text-xs text-gray-600 pt-1">Toca en **Ajustes** o **Menú** y selecciona **Dispositivos Vinculados**.</p>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="w-6 h-6 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold shrink-0">3</div>
                            <p className="text-xs text-gray-600 pt-1">Toca en **Vincular un dispositivo** y apunta tu cámara hacia este código.</p>
                        </div>
                    </div>

                    <div className="pt-4 border-t border-gray-50 flex items-center gap-6 justify-between">
                        <div className="flex items-center gap-2 text-[10px] text-gray-400 font-medium">
                            <ShieldCheck size={14} className="text-green-500" /> Cifrado de extremo a extremo
                        </div>
                        {status === "success" && (
                            <button
                                onClick={onSuccess}
                                className="flex items-center gap-2 bg-[#004A8D] text-white px-4 py-2 rounded-xl text-xs font-bold shadow-lg hover:shadow-blue-500/20 active:scale-95 transition-all"
                            >
                                Continuar al Dashboard <ArrowRight size={14} />
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Visual Progress Steps (WhatsApp Style) */}
            <div className="grid grid-cols-3 gap-4 pt-4">
                <div className="flex flex-col items-center gap-2 opacity-40">
                    <Smartphone size={20} className="text-gray-400" />
                    <div className="h-1 w-full bg-gray-100 rounded-full"></div>
                </div>
                <div className="flex flex-col items-center gap-2">
                    <QrCode size={20} className="text-blue-500" />
                    <div className="h-1 w-full bg-blue-500 rounded-full animate-pulse"></div>
                </div>
                <div className="flex flex-col items-center gap-2 opacity-40">
                    <Monitor size={20} className="text-gray-400" />
                    <div className="h-1 w-full bg-gray-100 rounded-full"></div>
                </div>
            </div>
        </div>
    );
}
