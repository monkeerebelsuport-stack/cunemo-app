"use client";

import dynamic from "next/dynamic";
import { Suspense, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

const OnboardingWizard = dynamic(
    () => import("@/components/onboarding/OnboardingWizard"),
    { ssr: false }
);

export default function OnboardingPage() {
    const router = useRouter();
    const [checking, setChecking] = useState(true);

    useEffect(() => {
        async function checkSession() {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push("/");
            } else {
                setChecking(false);
            }
        }
        checkSession();
    }, [router]);

    if (checking) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
                <div className="w-8 h-8 border-4 border-[#00AEEF] border-t-transparent rounded-full animate-spin mb-3"></div>
                <p className="text-[#004A8D] font-medium text-sm">Verificando sesión...</p>
            </div>
        );
    }

    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Cargando...</div>}>
            <OnboardingWizard />
        </Suspense>
    );
}
