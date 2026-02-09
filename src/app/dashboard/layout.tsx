"use client";
import { useRouter } from "next/navigation";

import { ReactNode } from "react";
import Sidebar from "@/components/layout/Sidebar";
import NotificationCenter from "@/components/dashboard/NotificationCenter";
import CunemoGuide from "@/components/layout/CunemoGuide";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function DashboardLayout({ children }: { children: ReactNode }) {
    const router = useRouter();
    const [userData, setUserData] = useState<{ name: string, avatar?: string } | null>(null);
    const [checking, setChecking] = useState(true);

    useEffect(() => {
        async function getUser() {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) {
                    router.push("/");
                    return;
                }
                setUserData({
                    name: user.user_metadata?.full_name || "Usuario",
                    avatar: user.user_metadata?.avatar_url
                });
            } catch (error) {
                router.push("/");
            } finally {
                setChecking(false);
            }
        }
        getUser();
    }, [router]);

    if (checking) {
        return (
            <div className="flex h-screen items-center justify-center bg-gray-50">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-4 border-[#00AEEF] border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-[#004A8D] font-medium text-sm">Verificando acceso...</p>
                </div>
            </div>
        );
    }

    if (!userData) return null; // Prevenir renderizado de dashboard si no hay usuario

    const initials = userData?.name
        ? userData.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
        : "U";

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar Dinámico */}
            <Sidebar />

            {/* Main Content */}
            <main className="flex-1 overflow-auto">
                <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-30">
                    <h2 className="text-lg font-bold text-gray-800" style={{ fontFamily: 'Montserrat, sans-serif' }}>CunemoClient</h2>
                    <div className="flex items-center gap-4">
                        <NotificationCenter />
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-xs font-bold text-blue-600 border-2 border-white shadow-sm overflow-hidden">
                            {userData?.avatar ? (
                                <Image
                                    src={userData.avatar}
                                    alt="Profile"
                                    width={40}
                                    height={40}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                initials
                            )}
                        </div>
                    </div>
                </header>
                <div className="p-8">
                    {children}
                </div>
            </main>
            <CunemoGuide />
        </div>
    );
}
