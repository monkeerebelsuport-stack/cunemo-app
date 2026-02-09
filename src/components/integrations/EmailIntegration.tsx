"use client";

import { useState } from "react";
import { ArrowLeft, Send, CheckCircle, AlertCircle, Loader2, Sparkles } from "lucide-react";

interface EmailIntegrationProps {
    onBack: () => void;
}

export default function EmailIntegration({ onBack }: EmailIntegrationProps) {
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [errorMsg, setErrorMsg] = useState("");
    const [formData, setFormData] = useState({
        to: "monkee.rebel.suport@gmail.com",
        subject: "Prueba desde Cunemo CRM 🚀",
        message: "¡Hola! Este es un correo enviado directamente desde nuestro nuevo motor de integración en CunemoClient. La potencia de automatización ya es una realidad."
    });

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("loading");
        setErrorMsg("");

        try {
            const res = await fetch("/api/email/send", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    to: formData.to,
                    subject: formData.subject,
                    html: `
                        <div style="font-family: sans-serif; padding: 20px; color: #333; line-height: 1.6;">
                            <h2 style="color: #004A8D;">CunemoClient 💎</h2>
                            <p>${formData.message}</p>
                            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
                            <p style="font-size: 12px; color: #999;">Enviado desde el tablero de integraciones de Anderson CRM.</p>
                        </div>
                    `
                })
            });

            const result = await res.json();
            if (!res.ok) throw new Error(result.error || "Error al enviar");

            setStatus("success");
            setTimeout(() => setStatus("idle"), 5000);
        } catch (err) {
            console.error(err);
            setStatus("error");
            setErrorMsg(err instanceof Error ? err.message : "Error al enviar");
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
                    <h2 className="text-2xl font-bold text-gray-800">Motor de Email Activo 📧</h2>
                    <p className="text-sm text-gray-500">Conectado vía Resend. Listo para enviar comunicaciones.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Formulario de Envío */}
                <div className="lg:col-span-2 space-y-6">
                    <form onSubmit={handleSend} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Destinatario</label>
                                <input
                                    type="email"
                                    value={formData.to}
                                    onChange={(e) => setFormData({ ...formData, to: e.target.value })}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Asunto</label>
                                <input
                                    type="text"
                                    value={formData.subject}
                                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-sm font-bold"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Mensaje</label>
                                <textarea
                                    rows={6}
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    className="w-full px-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 text-sm leading-relaxed"
                                    required
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between pt-4">
                            <button
                                type="submit"
                                disabled={status === "loading"}
                                className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-bold transition-all shadow-lg ${status === "loading"
                                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                    : "bg-[#004A8D] text-white hover:bg-blue-800 shadow-blue-500/20"
                                    }`}
                            >
                                {status === "loading" ? (
                                    <>
                                        <Loader2 size={20} className="animate-spin" /> Enviando...
                                    </>
                                ) : (
                                    <>
                                        <Send size={20} /> Enviar Ahora
                                    </>
                                )}
                            </button>

                            {status === "success" && (
                                <div className="flex items-center gap-2 text-green-600 font-bold text-sm animate-bounce">
                                    <CheckCircle size={20} /> ¡Correo enviado con éxito!
                                </div>
                            )}

                            {status === "error" && (
                                <div className="flex items-center gap-2 text-red-500 font-bold text-sm">
                                    <AlertCircle size={20} /> {errorMsg || "Error al enviar"}
                                </div>
                            )}
                        </div>
                    </form>
                </div>

                {/* Info & Settings */}
                <div className="space-y-6">
                    <div className="bg-gradient-to-br from-[#004A8D] to-blue-600 p-6 rounded-3xl text-white shadow-xl relative overflow-hidden">
                        <Sparkles size={120} className="absolute -right-8 -bottom-8 opacity-10 rotate-12" />
                        <h3 className="text-lg font-bold mb-4 relative z-10">Estado del Motor</h3>
                        <div className="space-y-4 relative z-10">
                            <div className="flex items-center justify-between text-xs">
                                <span className="opacity-70">Proveedor:</span>
                                <span className="font-bold">Resend ⚡</span>
                            </div>
                            <div className="flex items-center justify-between text-xs">
                                <span className="opacity-70">Domino:</span>
                                <span className="font-bold">onboarding@resend.dev</span>
                            </div>
                            <div className="flex items-center justify-between text-xs">
                                <span className="opacity-70">Límite diario:</span>
                                <span className="font-bold">100 / 100 libres</span>
                            </div>
                            <div className="pt-4">
                                <div className="h-1.5 w-full bg-white/20 rounded-full overflow-hidden">
                                    <div className="h-full w-4/5 bg-yellow-400 rounded-full" />
                                </div>
                                <p className="text-[10px] mt-2 opacity-60">Uso de cuota mensual: 2%</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                        <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Próximos Pasos</h4>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                                <CheckCircle className="text-gray-300" size={16} />
                                <span className="text-xs text-gray-500 font-medium">Sincronización de Inbox</span>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                                <CheckCircle className="text-gray-300" size={16} />
                                <span className="text-xs text-gray-500 font-medium">Plantillas Dinámicas</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
