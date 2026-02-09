"use client";

import { useState } from "react";
import { useContacts } from "@/hooks/useContacts";
import Modal from "@/components/ui/Modal";

interface NewContactModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function NewContactModal({ isOpen, onClose }: NewContactModalProps) {
    const [loading, setLoading] = useState(false);
    const { addContact } = useContacts();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        const contactData = {
            first_name: formData.get("first_name") as string,
            last_name: formData.get("last_name") as string,
            email: formData.get("email") as string,
            phone: formData.get("phone") as string,
            job_title: formData.get("job_title") as string,
        };

        try {
            await addContact(contactData);
            onClose();
        } catch {
            alert("Error al crear el contacto");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Nuevo Contacto">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                        <input
                            name="first_name"
                            type="text"
                            required
                            placeholder="Ej: Juan"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00AEEF] focus:border-transparent outline-none transition-all"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Apellido</label>
                        <input
                            name="last_name"
                            type="text"
                            required
                            placeholder="Ej: Pérez"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00AEEF] focus:border-transparent outline-none transition-all"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Correo Electrónico</label>
                    <input
                        name="email"
                        type="email"
                        required
                        placeholder="juan.perez@empresa.com"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00AEEF] focus:border-transparent outline-none transition-all"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                        <input
                            name="phone"
                            type="tel"
                            placeholder="+56 9 ..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00AEEF] focus:border-transparent outline-none transition-all"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Cargo / Puesto</label>
                        <input
                            name="job_title"
                            type="text"
                            placeholder="Ej: Director Comercial"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00AEEF] focus:border-transparent outline-none transition-all"
                        />
                    </div>
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
                        {loading ? "Creando..." : "Crear Contacto"}
                    </button>
                </div>
            </form>
        </Modal>
    );
}
