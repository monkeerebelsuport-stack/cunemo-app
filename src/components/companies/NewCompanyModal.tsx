"use client";

import { useState } from "react";
import { useCompanies } from "@/hooks/useCompanies";
import Modal from "@/components/ui/Modal";

interface NewCompanyModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function NewCompanyModal({ isOpen, onClose }: NewCompanyModalProps) {
    const [loading, setLoading] = useState(false);
    const { addCompany } = useCompanies();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        const companyData = {
            name: formData.get("name") as string,
            website: formData.get("website") as string,
            industry: formData.get("industry") as string,
            description: formData.get("description") as string,
        };

        try {
            await addCompany(companyData);
            onClose();
        } catch {
            alert("Error al crear la empresa");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Nueva Empresa">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de la Empresa</label>
                    <input
                        name="name"
                        type="text"
                        required
                        placeholder="Ej: Startup S.A."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00AEEF] focus:border-transparent outline-none transition-all"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Sitio Web</label>
                    <input
                        name="website"
                        type="url"
                        placeholder="https://example.com"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00AEEF] focus:border-transparent outline-none transition-all"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Industria</label>
                    <select
                        name="industry"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00AEEF] focus:border-transparent outline-none transition-all"
                    >
                        <option value="">Seleccionar industria...</option>
                        <option value="Tecnología">Tecnología</option>
                        <option value="Servicios Financieros">Servicios Financieros</option>
                        <option value="Comercio">Comercio</option>
                        <option value="Manufactura">Manufactura</option>
                        <option value="Educación">Educación</option>
                        <option value="Salud">Salud</option>
                        <option value="Otros">Otros</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Descripción / Notas</label>
                    <textarea
                        name="description"
                        rows={3}
                        placeholder="Breve descripción de la empresa..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00AEEF] focus:border-transparent outline-none transition-all resize-none"
                    />
                </div>

                <div className="pt-4 flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="btn-secondary"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary"
                    >
                        {loading ? "Creando..." : "Crear Empresa"}
                    </button>
                </div>
            </form>
        </Modal>
    );
}
