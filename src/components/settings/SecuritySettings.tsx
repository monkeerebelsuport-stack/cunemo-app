"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Shield, Key, Eye, EyeOff, Loader2, CheckCircle, Smartphone, X } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

export default function SecuritySettings() {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [showPasswords, setShowPasswords] = useState(false);
    const [formData, setFormData] = useState({
        newPassword: "",
        confirmPassword: ""
    });

    // States for 2FA
    const [mfaStatus, setMfaStatus] = useState<"idle" | "enrolling" | "verifying" | "active">("idle");
    const [qrCode, setQrCode] = useState<string | null>(null);
    const [factorId, setFactorId] = useState<string | null>(null);
    const [verificationCode, setVerificationCode] = useState("");
    const [verifying, setVerifying] = useState(false);

    useEffect(() => {
        checkMFAStatus();
    }, []);

    const checkMFAStatus = async () => {
        try {
            const { data, error } = await supabase.auth.mfa.listFactors();
            if (error) throw error;

            if (data?.all && data.all.length > 0) {
                const totpFactor = data.all.find((f: { factor_type: string; status: string }) => f.factor_type === 'totp' && f.status === 'verified');
                if (totpFactor) setMfaStatus("active");
            }
        } catch (err) {
            console.error("Error al verificar MFA:", err);
        }
    };

    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.newPassword !== formData.confirmPassword) {
            alert("Las contraseñas no coinciden.");
            return;
        }

        setLoading(true);
        setSuccess(false);

        try {
            const { error } = await supabase.auth.updateUser({
                password: formData.newPassword
            });

            if (error) throw error;

            setSuccess(true);
            setFormData({ newPassword: "", confirmPassword: "" });
            setTimeout(() => setSuccess(false), 5000);
        } catch (error) {
            if (error instanceof Error) {
                alert(error.message);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleEnrollMFA = async () => {
        setLoading(true);
        try {
            // 1. Limpieza preventiva: Buscamos factores no verificados
            const { data } = await supabase.auth.mfa.listFactors();
            const existingUnverified = data?.all?.find((f: { friendly_name?: string; status: string; factor_type: string; id: string }) =>
                (f.friendly_name === 'Mi Celular' || f.status === 'unverified') && f.factor_type === 'totp'
            );

            if (existingUnverified) {
                await supabase.auth.mfa.unenroll({ factorId: existingUnverified.id });
            }

            // 2. Iniciamos el nuevo enrolamiento
            const { data: enrollData, error } = await supabase.auth.mfa.enroll({
                factorType: 'totp',
                issuer: 'CunemoClient',
                friendlyName: 'Mi Celular'
            });

            if (error) throw error;

            setFactorId(enrollData.id);
            setQrCode(enrollData.totp.uri);
            setMfaStatus("enrolling");
        } catch (error) {
            if (error instanceof Error) {
                alert("Error al iniciar 2FA: " + error.message);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyMFA = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!factorId || verificationCode.length !== 6) return;

        setVerifying(true);
        try {
            const { error } = await supabase.auth.mfa.challengeAndVerify({
                factorId: factorId,
                code: verificationCode
            });

            if (error) throw error;

            setMfaStatus("active");
            setQrCode(null);
            setFactorId(null);
            setVerificationCode("");
        } catch {
            alert("Código inválido. Inténtalo de nuevo.");
        } finally {
            setVerifying(false);
        }
    };

    const handleDisable2FA = async () => {
        if (!confirm("¿Estás seguro de desactivar la protección de 2 pasos? Tu cuenta será menos segura.")) return;

        setLoading(true);
        try {
            const { data } = await supabase.auth.mfa.listFactors();
            const factor = data?.all?.find((f: { factor_type: string; status: string; id: string }) => f.factor_type === 'totp' && f.status === 'verified');
            if (factor) {
                await supabase.auth.mfa.unenroll({ factorId: factor.id });
                setMfaStatus("idle");
            }
        } catch (error) {
            if (error instanceof Error) {
                alert(error.message);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-xl animate-fadeIn space-y-8">
            {/* Password Section */}
            <div className="space-y-6">
                <div className="flex items-start gap-4 p-4 bg-blue-50/50 rounded-2xl border border-blue-100">
                    <div className="p-2 bg-white rounded-xl text-[#00AEEF] shadow-sm">
                        <Shield size={20} />
                    </div>
                    <div>
                        <h4 className="text-sm font-bold text-blue-900">Seguridad de la Cuenta</h4>
                        <p className="text-xs text-blue-800/70 mt-1 leading-relaxed">
                            Te recomendamos usar una contraseña de al menos 12 caracteres mezclando letras, números y símbolos.
                        </p>
                    </div>
                </div>

                <form onSubmit={handleUpdatePassword} className="space-y-6">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                <Key size={14} /> Nueva Contraseña
                            </label>
                            <div className="relative">
                                <input
                                    type={showPasswords ? "text" : "password"}
                                    value={formData.newPassword}
                                    onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                                    required
                                    minLength={6}
                                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#00AEEF] outline-none transition-all text-sm text-gray-700 pr-12"
                                    placeholder="••••••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPasswords(!showPasswords)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    {showPasswords ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                <Key size={14} /> Confirmar Contraseña
                            </label>
                            <input
                                type={showPasswords ? "text" : "password"}
                                value={formData.confirmPassword}
                                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                required
                                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#00AEEF] outline-none transition-all text-sm text-gray-700"
                                placeholder="••••••••••••"
                            />
                        </div>
                    </div>

                    <div className="pt-2 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            {success && (
                                <span className="flex items-center gap-1.5 text-green-500 text-xs font-bold animate-fadeIn">
                                    <CheckCircle size={16} /> Contraseña actualizada
                                </span>
                            )}
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary min-w-[160px] shadow-lg shadow-blue-500/20"
                        >
                            {loading ? <Loader2 className="animate-spin" size={18} /> : "Actualizar Seguridad"}
                        </button>
                    </div>
                </form>
            </div>

            {/* 2FA Section */}
            <div className="pt-8 border-t border-gray-50">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Autenticación en dos pasos (2FA)</h4>

                {mfaStatus === "active" ? (
                    <div className="p-6 bg-green-50 rounded-2xl border border-green-100 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-white rounded-xl text-green-500 shadow-sm">
                                <Shield size={24} />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-green-900">Protección Activa</p>
                                <p className="text-xs text-green-700 mt-0.5">Tu cuenta está blindada con una app de autenticación.</p>
                            </div>
                        </div>
                        <button
                            onClick={handleDisable2FA}
                            disabled={loading}
                            className="text-xs font-bold text-red-500 hover:text-red-700 transition-colors bg-white px-4 py-2 rounded-xl border border-red-100 shadow-sm"
                        >
                            Desactivar
                        </button>
                    </div>
                ) : mfaStatus === "enrolling" ? (
                    <div className="p-6 bg-white rounded-3xl border-2 border-[#00AEEF]/20 relative overflow-hidden animate-fadeIn">
                        <button
                            onClick={() => setMfaStatus("idle")}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                        >
                            <X size={20} />
                        </button>

                        <div className="text-center space-y-6">
                            <div className="space-y-2">
                                <h5 className="font-bold text-gray-800">Vincula tu Celular</h5>
                                <p className="text-xs text-gray-500">Escanea el QR con Google Authenticator o Authy.</p>
                            </div>

                            <div className="flex justify-center bg-white p-4 rounded-2xl border border-gray-100 shadow-inner inline-block mx-auto">
                                {qrCode && <QRCodeSVG value={qrCode} size={180} level="H" includeMargin={false} />}
                            </div>

                            <form onSubmit={handleVerifyMFA} className="space-y-4 max-w-[240px] mx-auto">
                                <input
                                    type="text"
                                    maxLength={6}
                                    value={verificationCode}
                                    onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                                    className="w-full text-center text-2xl font-bold tracking-[0.5em] py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#00AEEF] outline-none"
                                    placeholder="000000"
                                    autoFocus
                                />
                                <button
                                    type="submit"
                                    disabled={verifying || verificationCode.length !== 6}
                                    className="w-full btn-primary"
                                >
                                    {verifying ? <Loader2 className="animate-spin mx-auto" size={18} /> : "Verificar y Activar"}
                                </button>
                            </form>
                        </div>
                    </div>
                ) : (
                    <div className="p-4 bg-gray-50 rounded-2xl border border-dashed border-gray-200 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-white rounded-lg text-gray-400">
                                <Smartphone size={18} />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-gray-600">Proteger con App de Autenticación</p>
                                <p className="text-[10px] text-gray-400 mt-0.5">Google Authenticator, Authy, Microsoft Auth.</p>
                            </div>
                        </div>
                        <button
                            onClick={handleEnrollMFA}
                            className="text-xs font-bold text-[#00AEEF] hover:text-[#004A8D] transition-colors bg-white px-4 py-2 rounded-xl border border-gray-100 shadow-sm"
                        >
                            Activar 2FA
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
