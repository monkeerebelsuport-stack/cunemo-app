"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { User, Mail, Briefcase, Camera, Loader2, Save, Check } from "lucide-react";

export default function ProfileSettings() {
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [saved, setSaved] = useState(false);
    const [userData, setUserData] = useState({
        full_name: "",
        email: "",
        job_title: "",
        avatar_url: ""
    });

    useEffect(() => {
        async function getProfile() {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                setUserData({
                    full_name: user.user_metadata?.full_name || "",
                    email: user.email || "",
                    job_title: user.user_metadata?.job_title || "",
                    avatar_url: user.user_metadata?.avatar_url || ""
                });
            }
        }
        getProfile();
    }, []);

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setSaved(false);

        try {
            const { error } = await supabase.auth.updateUser({
                data: {
                    full_name: userData.full_name,
                    job_title: userData.job_title
                }
            });

            if (error) throw error;
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        } catch (error) {
            if (error instanceof Error) {
                alert(error.message);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("No user found");

            const fileExt = file.name.split('.').pop();
            const fileName = `${user.id}-${Math.random()}.${fileExt}`;
            const filePath = `${fileName}`;

            // 1. Upload to Supabase Storage (Bucket: avatars)
            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            // 2. Get Public URL
            const { data: { publicUrl } } = supabase.storage
                .from('avatars')
                .getPublicUrl(filePath);

            // 3. Update User Metadata
            const { error: updateError } = await supabase.auth.updateUser({
                data: { avatar_url: publicUrl }
            });

            if (updateError) throw updateError;

            setUserData(prev => ({ ...prev, avatar_url: publicUrl }));
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        } catch (error) {
            console.error("Error uploading avatar:", error);
            alert("Error al subir la imagen. Asegúrate de que el bucket 'avatars' (público) exista en tu consola de Supabase.");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="max-w-2xl animate-fadeIn">
            <div className="flex items-center gap-6 mb-10">
                <div className="relative group">
                    <div className="w-24 h-24 bg-blue-100 rounded-3xl flex items-center justify-center text-[#00AEEF] text-3xl font-bold shadow-inner overflow-hidden border-4 border-white relative">
                        {uploading && (
                            <div className="absolute inset-0 bg-white/60 flex items-center justify-center z-10 backdrop-blur-sm">
                                <Loader2 className="animate-spin text-[#00AEEF]" size={24} />
                            </div>
                        )}
                        {userData.avatar_url ? (
                            <img src={userData.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            userData.full_name ? userData.full_name[0].toUpperCase() : "U"
                        )}
                    </div>
                    <label className="absolute -bottom-2 -right-2 p-2 bg-white rounded-xl shadow-lg border border-gray-100 text-gray-400 hover:text-[#00AEEF] transition-all transform hover:scale-110 cursor-pointer">
                        <Camera size={18} />
                        <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={handleAvatarUpload}
                            disabled={uploading}
                        />
                    </label>
                </div>
                <div>
                    <h3 className="text-xl font-bold text-gray-800">{userData.full_name || "Usuario del Sistema"}</h3>
                    <p className="text-sm text-gray-400">{userData.job_title || "CRM Manager"}</p>
                </div>
            </div>

            <form onSubmit={handleUpdateProfile} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                            <User size={14} /> Nombre Completo
                        </label>
                        <input
                            type="text"
                            value={userData.full_name}
                            onChange={(e) => setUserData({ ...userData, full_name: e.target.value })}
                            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#00AEEF] outline-none transition-all text-sm text-gray-700"
                            placeholder="Ej: Juan Pérez"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                            <Mail size={14} /> Correo Electrónico
                        </label>
                        <input
                            type="email"
                            value={userData.email}
                            disabled
                            className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl text-sm text-gray-400 cursor-not-allowed italic"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                            <Briefcase size={14} /> Cargo / Puesto
                        </label>
                        <input
                            type="text"
                            value={userData.job_title}
                            onChange={(e) => setUserData({ ...userData, job_title: e.target.value })}
                            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#00AEEF] outline-none transition-all text-sm text-gray-700"
                            placeholder="Ej: Director Comercial"
                        />
                    </div>
                </div>

                <div className="pt-6 flex items-center justify-between border-t border-gray-50">
                    <div className="flex items-center gap-2">
                        {saved && (
                            <span className="flex items-center gap-1.5 text-green-500 text-xs font-bold animate-fadeIn">
                                <Check size={16} /> Cambios guardados
                            </span>
                        )}
                    </div>
                    <button
                        type="submit"
                        disabled={loading || uploading}
                        className="btn-primary min-w-[140px] shadow-lg shadow-blue-500/20"
                    >
                        {loading ? (
                            <Loader2 className="animate-spin" size={18} />
                        ) : (
                            <>
                                <Save size={18} /> Guardar Cambios
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
