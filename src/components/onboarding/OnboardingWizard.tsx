"use client";

import { useState } from "react";
import ProfileStep from "./steps/ProfileStep";
import FirstDealStep from "./steps/FirstDealStep";
import ContactSeedStep from "./steps/ContactSeedStep"; // Importado correctamente
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
import { saveOnboardingData } from "@/lib/actions/onboarding";
import AIConsultantChat from "./AIConsultantChat";

export default function OnboardingWizard() {
    const [currentStep, setCurrentStep] = useState(0); // Empezamos en 0 (AI Chat)
    const [loading, setLoading] = useState(false);
    const [showAIChat, setShowAIChat] = useState(true);

    // Estado único para todo el wizard
    const [formData, setFormData] = useState({
        // Step 1: Profile
        role: "",
        industry: "",
        currency: "USD",
        // Step 2: Contacts
        seedContacts: [] as { name: string; company: string; email: string }[],
        // Step 3: First Deal
        firstDeal: { title: "", value: "", probability: "" }
    });

    const router = useRouter();

    const handleNext = () => {
        if (currentStep < 3) {
            setCurrentStep(prev => prev + 1);
        } else {
            handleFinalize();
        }
    };

    const handleFinalize = async () => {
        setLoading(true);
        try {

            await saveOnboardingData(formData);
            router.push("/dashboard");
        } catch (error) {
            console.error("Error saving onboarding:", error);
            alert("Hubo un error guardando tus datos. Revisa la consola.");
        } finally {
            setLoading(false);
        }
    };

    const updateData = (data: Partial<typeof formData>) => {
        setFormData(prev => ({ ...prev, ...data }));
    };

    const handleAIComplete = (aiData: any) => {
        setFormData(prev => ({
            ...prev,
            industry: aiData.industry || prev.industry,
            // Podríamos mapear más datos aquí
        }));
        setCurrentStep(1);
        setShowAIChat(false);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center pt-20 px-4">
            {/* Progress Header */}
            <div className="w-full max-w-2xl mb-12">
                <div className="flex justify-between items-center relative">
                    {/* Progress Bar Background */}
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-200 rounded-full -z-10"></div>
                    {/* Progress Bar Active */}
                    <div
                        className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-[#00AEEF] rounded-full -z-10 transition-all duration-500 ease-out"
                        style={{ width: `${((currentStep - 1) / 2) * 100}%` }}
                    ></div>

                    {[1, 2, 3].map((step) => {
                        const isActive = step === currentStep;
                        const isCompleted = step < currentStep;

                        return (
                            <div
                                key={step}
                                className={`
                            w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 border-4
                            ${isActive ? "bg-white border-[#00AEEF] text-[#00AEEF] scale-110 shadow-lg" : ""}
                            ${isCompleted ? "bg-[#00AEEF] border-[#00AEEF] text-white" : ""}
                            ${!isActive && !isCompleted ? "bg-white border-gray-200 text-gray-400" : ""}
                        `}
                            >
                                {isCompleted ? <Check size={18} /> : step}
                            </div>
                        );
                    })}
                </div>
                <div className="flex justify-between text-xs font-medium text-gray-400 mt-2 px-1">
                    <span className={currentStep >= 1 ? "text-[#004A8D]" : ""}>Tu Perfil</span>
                    <span className={currentStep >= 2 ? "text-[#004A8D]" : ""}>Contactos Clave</span>
                    <span className={currentStep >= 3 ? "text-[#004A8D]" : ""}>Primer Negocio</span>
                </div>
            </div>

            {/* Step Content Card */}
            <div className={`w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-gray-100 animate-fadeIn relative overflow-hidden ${currentStep === 0 ? "p-0" : "p-8"}`}>
                {loading && (
                    <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center rounded-2xl">
                        <div className="flex flex-col items-center gap-3">
                            <div className="w-8 h-8 border-4 border-[#00AEEF] border-t-transparent rounded-full animate-spin"></div>
                            <p className="text-[#004A8D] font-bold">Configurando tu CRM...</p>
                        </div>
                    </div>
                )}

                {currentStep === 0 && (
                    <AIConsultantChat onComplete={handleAIComplete} />
                )}

                {currentStep === 1 && (
                    <ProfileStep
                        data={formData}
                        updateData={updateData}
                        onNext={handleNext}
                    />
                )}
                {currentStep === 2 && (
                    <ContactSeedStep
                        updateData={updateData}
                        onNext={handleNext}
                    />
                )}
                {currentStep === 3 && (
                    <FirstDealStep
                        updateData={updateData}
                        onNext={handleNext}
                    />
                )}
            </div>

            {/* Footer Helper */}
            <p className="mt-8 text-gray-400 text-sm">
                Te tomará menos de 5 minutos. <span className="underline cursor-pointer hover:text-gray-600">Omitir configuración</span>
            </p>
        </div>
    );
}
