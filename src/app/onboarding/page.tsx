"use client";
import dynamic from "next/dynamic";
import { Suspense } from "react";

const OnboardingWizard = dynamic(
    () => import("@/components/onboarding/OnboardingWizard"),
    { ssr: false }
);

export default function OnboardingPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Cargando...</div>}>
            <OnboardingWizard />
        </Suspense>
    );
}
