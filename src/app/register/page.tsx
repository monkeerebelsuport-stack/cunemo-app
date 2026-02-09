"use client";
export const dynamic = 'force-dynamic';

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import "../globals.css";

export default function Register() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1); // 1: Credenciales, 2: Perfil, 3: Empresa
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        confirmPassword: "",
        name: "",
        phone: "",
        company: "",
        terms: false,
    });
    const [error, setError] = useState<string | null>(null);
    const [showUserExistsModal, setShowUserExistsModal] = useState(false);

    const getPasswordStrength = (password: string) => {
        if (!password) return 0;
        let score = 0;
        if (password.length >= 8) score++;
        if (password.length >= 12) score++;
        if (/[A-Z]/.test(password)) score++;
        if (/[0-9]/.test(password)) score++;
        if (/[^A-Za-z0-9]/.test(password)) score++;
        return score;
    };

    const strength = getPasswordStrength(formData.password);

    const getStrengthColor = (s: number) => {
        if (s <= 1) return "#EF4444"; // Red
        if (s === 2) return "#F97316"; // Orange
        if (s === 3) return "#EAB308"; // Yellow
        if (s === 4) return "#00AEEF"; // Blue
        return "#8DC63F"; // Green
    };

    const getStrengthText = (s: number) => {
        if (s === 0) return "";
        if (s <= 1) return "Muy Débil";
        if (s === 2) return "Débil";
        if (s === 3) return "Media";
        if (s === 4) return "Segura";
        return "Muy Segura";
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const validateStep1 = () => {
        if (!formData.email || !formData.password || !formData.confirmPassword) {
            setError("Por favor completa todos los campos.");
            return false;
        }
        if (formData.password !== formData.confirmPassword) {
            setError("Las contraseñas no coinciden.");
            return false;
        }
        if (formData.password.length < 6) {
            setError("La contraseña debe tener al menos 6 caracteres.");
            return false;
        }
        setError(null);
        return true;
    };

    const validateStep2 = () => {
        if (!formData.name || !formData.phone) {
            setError("Por favor completa tu perfil.");
            return false;
        }
        setError(null);
        return true;
    };

    const validateStep3 = () => {
        if (!formData.company) {
            setError("El nombre de la empresa es obligatorio.");
            return false;
        }
        if (!formData.terms) {
            setError("Debes aceptar los Términos y Condiciones.");
            return false;
        }
        setError(null);
        return true;
    };

    const nextStep = () => {
        if (step === 1 && validateStep1()) setStep(2);
        if (step === 2 && validateStep2()) setStep(3);
    };

    const prevStep = () => setStep(step - 1);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateStep3()) return;

        setLoading(true);
        setError(null);

        try {
            // 0. Seguridad Avanzada: Verificar duplicados antes de proceder

            // A. Verificar Empresa duplicada
            const { data: existingAccount } = await supabase
                .from("accounts")
                .select("id")
                .eq("name", formData.company)
                .maybeSingle();

            if (existingAccount) {
                setError(`La empresa "${formData.company}" ya está registrada. Por favor usa un nombre diferente o contacta a soporte.`);
                setLoading(false);
                return;
            }

            // B. Verificar Teléfono duplicado (en accounts o contacts)
            const { data: existingPhoneAccount } = await supabase
                .from("accounts")
                .select("id")
                .eq("phone", formData.phone)
                .maybeSingle();

            const { data: existingPhoneContact } = await supabase
                .from("contacts")
                .select("id")
                .eq("phone", formData.phone)
                .maybeSingle();

            if (existingPhoneAccount || existingPhoneContact) {
                setError("Este número de teléfono ya está vinculado a una cuenta existente.");
                setLoading(false);
                return;
            }

            // C. Verificar Nombre de Usuario (Opcional, pero solicitado)
            const { data: existingName } = await supabase
                .from("contacts")
                .select("id")
                .ilike("first_name", `%${formData.name.split(' ')[0]}%`)
                .maybeSingle();

            // Nota: El chequeo de nombre es más flexible para evitar bloqueos injustos, 
            // pero podemos ser más estrictos si el usuario lo prefiere.

            // 1. Auth: Crear usuario
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email: formData.email,
                password: formData.password,
                options: {
                    data: {
                        full_name: formData.name,
                        company_name: formData.company,
                    },
                },
            });

            if (authError) throw authError;
            if (!authData.user) throw new Error("No se pudo crear el usuario");

            // 2. Company: Crear registro en accounts
            const { data: accountData, error: accountError } = await supabase
                .from("accounts")
                .insert([{ name: formData.company, phone: formData.phone }])
                .select()
                .single();

            if (accountError) throw accountError;

            // 3. Contact: Crear admin en contacts
            const nameParts = formData.name.split(" ");
            const firstName = nameParts[0];
            const lastName = nameParts.slice(1).join(" ") || "";

            const { error: contactError } = await supabase.from("contacts").insert([
                {
                    account_id: accountData.id,
                    first_name: firstName,
                    last_name: lastName,
                    email: formData.email,
                    phone: formData.phone,
                    job_title: "Administrador",
                },
            ]);

            if (contactError) throw contactError;

            alert("¡Cuenta creada exitosamente! Bienvenido a CunemoClient.");
            router.push("/");
        } catch (err: any) {
            console.error("Error:", err);

            // Interceptar error de usuario ya registrado
            const errorMsg = err?.message?.toLowerCase() || "";
            if (errorMsg.includes("already registered") || errorMsg.includes("already exists") || err?.status === 422) {
                setShowUserExistsModal(true);
                return;
            }

            if (err instanceof Error) {
                setError(err.message || "Error al crear la cuenta");
            } else {
                setError("Error al crear la cuenta");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="split-login-container">
            {/* Left Panel */}
            <div className="login-left-panel">
                <div className="login-form-wrapper">
                    {/* Header */}
                    <div className="mb-6">
                        <h1 style={{ fontFamily: "Montserrat", fontSize: "2rem", fontWeight: 700, color: "#004A8D" }}>
                            Crear Cuenta v2.1
                        </h1>
                        <p className="text-gray-500 text-sm mt-1">
                            Paso {step} de 3: {step === 1 ? "Credenciales" : step === 2 ? "Perfil Personal" : "Tu Empresa"}
                        </p>
                        {/* Progress Bar */}
                        <div className="w-full h-1 bg-gray-200 mt-4 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-[#8DC63F] transition-all duration-300 ease-out"
                                style={{ width: `${(step / 3) * 100}%` }}
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm mb-4 border border-red-100 flex items-center gap-2">
                            ⚠️ {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* STEP 1: Credenciales */}
                        {step === 1 && (
                            <div className="space-y-4 animate-fadeIn">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Email Corporativo</label>
                                    <input
                                        name="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00AEEF] focus:border-transparent transition-all outline-none"
                                        placeholder="nombre@empresa.com"
                                        autoFocus
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Contraseña</label>
                                        <input
                                            name="password"
                                            type="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00AEEF] focus:border-transparent transition-all outline-none"
                                            placeholder="••••••••"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Confirmar</label>
                                        <input
                                            name="confirmPassword"
                                            type="password"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00AEEF] focus:border-transparent transition-all outline-none"
                                            placeholder="••••••••"
                                        />
                                    </div>
                                </div>

                                {/* Barra de Seguridad de Contraseña */}
                                {formData.password && (
                                    <div className="animate-fadeIn">
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Seguridad: {getStrengthText(strength)}</span>
                                            <span className="text-[10px] text-gray-400 font-medium">Mín. 8 caracteres</span>
                                        </div>
                                        <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden flex gap-0.5">
                                            {[1, 2, 3, 4, 5].map((idx) => (
                                                <div
                                                    key={idx}
                                                    className="h-full flex-1 transition-all duration-500"
                                                    style={{
                                                        backgroundColor: idx <= strength ? getStrengthColor(strength) : "#F3F4F6",
                                                        opacity: idx <= strength ? 1 : 0.3
                                                    }}
                                                />
                                            ))}
                                        </div>

                                        {/* Ejemplo y Tips */}
                                        <div className="mt-3 p-3 bg-blue-50/50 rounded-lg border border-blue-100/50">
                                            <p className="text-[11px] text-[#004A8D] font-medium mb-1 flex items-center gap-1">
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                                                    <path fillRule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-7-4a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM9 9a.75.75 0 0 0 0 1.5h.253a.25.25 0 0 1 .244.304l-.459 2.066A1.75 1.75 0 0 0 10.747 15H11a.75.75 0 0 0 0-1.5h-.253a.25.25 0 0 1-.244-.304l.459-2.066A1.75 1.75 0 0 0 9.253 9H9Z" clipRule="evenodd" />
                                                </svg>
                                                Ejemplo de contraseña segura:
                                            </p>
                                            <code className="text-[11px] bg-white px-2 py-1 rounded border border-blue-200 text-gray-700 block w-fit font-mono">
                                                CuN€mo.2026!
                                            </code>
                                            <ul className="mt-2 space-y-1">
                                                <li className="text-[10px] text-gray-500 flex items-center gap-1">
                                                    <div className={`w-1 h-1 rounded-full ${formData.password.length >= 8 ? 'bg-green-500' : 'bg-gray-300'}`} /> Mínimo 8 caracteres
                                                </li>
                                                <li className="text-[10px] text-gray-500 flex items-center gap-1">
                                                    <div className={`w-1 h-1 rounded-full ${/[A-Z]/.test(formData.password) ? 'bg-green-500' : 'bg-gray-300'}`} /> Incluir Mayúsculas (A)
                                                </li>
                                                <li className="text-[10px] text-gray-500 flex items-center gap-1">
                                                    <div className={`w-1 h-1 rounded-full ${/[0-9]/.test(formData.password) ? 'bg-green-500' : 'bg-gray-300'}`} /> Incluir Números (1)
                                                </li>
                                                <li className="text-[10px] text-gray-500 flex items-center gap-1">
                                                    <div className={`w-1 h-1 rounded-full ${/[^A-Za-z0-9]/.test(formData.password) ? 'bg-green-500' : 'bg-gray-300'}`} /> Símbolos (!@#)
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                )}

                                <button
                                    type="button"
                                    onClick={nextStep}
                                    className="btn-primary w-full mt-2"
                                >
                                    Continuar →
                                </button>
                            </div>
                        )}

                        {/* STEP 2: Perfil */}
                        {step === 2 && (
                            <div className="space-y-4 animate-fadeIn">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Nombre Completo</label>
                                    <input
                                        name="name"
                                        type="text"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00AEEF] focus:border-transparent transition-all outline-none"
                                        placeholder="Ej. Ana García"
                                        autoFocus
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Teléfono / Móvil</label>
                                    <input
                                        name="phone"
                                        type="tel"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00AEEF] focus:border-transparent transition-all outline-none"
                                        placeholder="+51 900 000 000"
                                    />
                                </div>
                                <div className="flex gap-3 mt-4">
                                    <button
                                        type="button"
                                        onClick={prevStep}
                                        className="flex-1 p-3 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                                    >
                                        Atrás
                                    </button>
                                    <button
                                        type="button"
                                        onClick={nextStep}
                                        className="flex-1 btn-primary"
                                    >
                                        Siguiente
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* STEP 3: Empresa */}
                        {step === 3 && (
                            <div className="space-y-4 animate-fadeIn">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Nombre de la Empresa</label>
                                    <input
                                        name="company"
                                        type="text"
                                        value={formData.company}
                                        onChange={handleChange}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00AEEF] focus:border-transparent transition-all outline-none"
                                        placeholder="Ej. Tecnologías S.A.C."
                                        autoFocus
                                    />
                                </div>

                                <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg border border-blue-100">
                                    <input
                                        id="terms"
                                        name="terms"
                                        type="checkbox"
                                        checked={formData.terms}
                                        onChange={handleChange}
                                        className="mt-1 w-4 h-4 text-[#00AEEF] rounded focus:ring-[#00AEEF]"
                                    />
                                    <label htmlFor="terms" className="text-xs text-gray-600 leading-relaxed">
                                        Al crear una cuenta, aceptas nuestros <a href="#" className="text-[#00AEEF] font-semibold hover:underline">Términos de Servicio</a> y <a href="#" className="text-[#00AEEF] font-semibold hover:underline">Política de Privacidad</a>.
                                    </label>
                                </div>

                                <div className="flex gap-3 mt-4">
                                    <button
                                        type="button"
                                        onClick={prevStep}
                                        className="flex-1 p-3 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                                    >
                                        Atrás
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {loading ? "Registrando..." : "Finalizar Registro"}
                                    </button>
                                </div>
                            </div>
                        )}
                    </form>

                    {step === 1 && (
                        <p className="text-center text-sm text-gray-500 mt-8">
                            ¿Ya tienes cuenta?{" "}
                            <Link href="/" className="text-[#00AEEF] font-semibold hover:underline">
                                Inicia sesión aquí
                            </Link>
                        </p>
                    )}
                </div>
            </div>

            {/* Right Panel */}
            <div className="login-right-panel">
                <div className="image-overlay"></div>
                <div className="image-container">
                    <Image
                        src="/material/312.png"
                        alt="CRM Dashboard"
                        fill
                        style={{ objectFit: "contain", objectPosition: "center" }}
                        priority
                    />
                </div>
            </div>

            {/* Modal: Usuario ya existe */}
            {showUserExistsModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center animate-scaleIn">
                        <div className="w-20 h-20 bg-blue-50 text-[#004A8D] rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                            </svg>
                        </div>

                        <h2 className="text-2xl font-bold text-gray-900 mb-2">¡Ya tienes una cuenta!</h2>
                        <p className="text-gray-600 mb-8">
                            Parece que el correo <span className="font-semibold text-[#004A8D]">{formData.email}</span> ya está registrado en Cunemo CRM.
                        </p>

                        <div className="space-y-3">
                            <Link
                                href="/"
                                className="block w-full p-4 bg-[#004A8D] text-white rounded-xl font-bold hover:bg-[#003a6e] transition-all shadow-lg shadow-blue-900/20"
                            >
                                Iniciar Sesión Ahora
                            </Link>
                            <button
                                onClick={() => setShowUserExistsModal(false)}
                                className="block w-full p-4 text-gray-500 hover:text-gray-700 font-medium transition-colors"
                            >
                                Usar otro correo electrónico
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
