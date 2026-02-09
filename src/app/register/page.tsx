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
        } catch (err) {
            console.error("Error:", err);
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
                            Crear Cuenta
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
                                <button
                                    type="button"
                                    onClick={nextStep}
                                    className="btn-primary w-full mt-2"
                                >
                                    Continuar
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
        </div>
    );
}
