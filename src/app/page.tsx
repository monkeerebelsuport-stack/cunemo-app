"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import "./globals.css";

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAuthErrorModal, setShowAuthErrorModal] = useState(false);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      router.push("/dashboard");
    } catch (err) {
      console.error("Error de login:", err);
      setShowAuthErrorModal(true);
      setError("Credenciales inválidas. Por favor verifica tu correo y contraseña.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="split-login-container">
      {/* Panel Izquierdo - Formulario */}
      <div className="login-left-panel">
        <div className="login-form-wrapper">
          <div className="mb-8">
            <h1
              style={{
                fontFamily: "Montserrat, sans-serif",
                fontSize: "2.25rem",
                fontWeight: 700,
                color: "#004A8D",
                marginBottom: "0.5rem",
              }}
            >
              CunemoClient
            </h1>
            <p className="text-gray-600" style={{ fontSize: "1rem" }}>
              Gestión inteligente de relaciones con clientes
            </p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm mb-4 border border-red-100">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Correo Electrónico
              </label>
              <input
                name="email"
                id="email"
                type="email"
                placeholder="tu@empresa.com"
                required
                disabled={loading}
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Contraseña
              </label>
              <input
                name="password"
                id="password"
                type="password"
                placeholder="••••••••"
                required
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              className="btn-primary w-full"
              disabled={loading}
              style={{ opacity: loading ? 0.7 : 1 }}
            >
              {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-6">
            ¿No tienes cuenta?{" "}
            <Link href="/register" style={{ color: "#00AEEF", fontWeight: 500 }}>
              Regístrate aquí
            </Link>
          </p>
        </div>
      </div>

      {/* Panel Derecho - Imagen */}
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

      {/* Modal: Error de Autenticación Profesional */}
      {showAuthErrorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center animate-scaleIn">
            <div className="w-20 h-20 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
              </svg>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-2">Error de Acceso</h2>
            <p className="text-gray-600 mb-8">
              Las credenciales ingresadas no son correctas. Por favor, verifica tu correo y contraseña e intenta de nuevo.
            </p>

            <div className="space-y-3">
              <button
                onClick={() => setShowAuthErrorModal(false)}
                className="block w-full p-4 bg-[#004A8D] text-white rounded-xl font-bold hover:bg-[#003a6e] transition-all shadow-lg shadow-blue-900/20"
              >
                Reintentar
              </button>
              <Link
                href="/register"
                className="block w-full p-4 text-[#00AEEF] hover:text-[#008ec3] font-medium transition-colors"
              >
                ¿No tienes cuenta? Regístrate
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
