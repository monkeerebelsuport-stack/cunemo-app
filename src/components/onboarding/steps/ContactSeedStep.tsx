"use client";
import React, { useState } from "react";
import { Plus, Trash2 } from "lucide-react";

interface Contact {
    name: string;
    company: string;
    email: string;
}

interface ContactSeedStepProps {
    updateData: (data: { seedContacts: Contact[] }) => void;
    onNext: () => void;
}

export default function ContactSeedStep({ updateData, onNext }: ContactSeedStepProps) {
    const [contacts, setContacts] = useState<Contact[]>([
        { name: "", company: "", email: "" },
        { name: "", company: "", email: "" },
        { name: "", company: "", email: "" },
    ]);

    const handleChange = (index: number, field: keyof Contact, value: string) => {
        const newContacts = [...contacts];
        newContacts[index] = { ...newContacts[index], [field]: value };
        setContacts(newContacts);
        updateData({ seedContacts: newContacts });
    };

    const addRow = () => {
        setContacts([...contacts, { name: "", company: "", email: "" }]);
    };

    const removeRow = (index: number) => {
        if (contacts.length <= 1) return;
        const newContacts = contacts.filter((_, i) => i !== index);
        setContacts(newContacts);
    };

    const validContactsCount = contacts.filter(
        (c) => c.name.trim() !== "" && c.company.trim() !== ""
    ).length;

    return (
        <div className="space-y-6">
            <div className="text-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800 mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    Agrega a tus Clientes Clave 👥
                </h1>
                <p className="text-gray-500">
                    Un CRM vacío es triste. Agrega al menos 1 contacto real para empezar.
                </p>
            </div>

            <div className="space-y-3">
                {/* Header Row */}
                <div className="grid grid-cols-12 gap-3 px-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    <div className="col-span-4">Nombre Completo</div>
                    <div className="col-span-4">Empresa / Negocio</div>
                    <div className="col-span-3">Email (Opcional)</div>
                    <div className="col-span-1"></div>
                </div>

                {/* Input Rows */}
                {contacts.map((contact, index) => (
                    <div key={index} className="grid grid-cols-12 gap-3 items-center animate-fadeIn">
                        <div className="col-span-4">
                            <input
                                type="text"
                                placeholder="Ej. Juan Pérez"
                                value={contact.name}
                                onChange={(e) => handleChange(index, "name", e.target.value)}
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#00AEEF] focus:border-transparent outline-none bg-gray-50 focus:bg-white transition-all text-sm"
                            />
                        </div>
                        <div className="col-span-4">
                            <input
                                type="text"
                                placeholder="Ej. Tech Solutions"
                                value={contact.company}
                                onChange={(e) => handleChange(index, "company", e.target.value)}
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#00AEEF] focus:border-transparent outline-none bg-gray-50 focus:bg-white transition-all text-sm"
                            />
                        </div>
                        <div className="col-span-3">
                            <input
                                type="email"
                                placeholder="juan@tech.com"
                                value={contact.email}
                                onChange={(e) => handleChange(index, "email", e.target.value)}
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#00AEEF] focus:border-transparent outline-none bg-gray-50 focus:bg-white transition-all text-sm"
                            />
                        </div>
                        <div className="col-span-1 flex justify-center">
                            {contacts.length > 1 && (
                                <button
                                    onClick={() => removeRow(index)}
                                    className="text-gray-300 hover:text-red-400 transition-colors p-1"
                                >
                                    <Trash2 size={16} />
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <button
                onClick={addRow}
                className="text-[#00AEEF] text-sm font-semibold flex items-center gap-1 hover:underline mt-2 px-2"
            >
                <Plus size={16} /> Agregar otro contacto
            </button>

            <div className="pt-6">
                <button
                    onClick={onNext}
                    disabled={validContactsCount < 1}
                    className={`
                w-full py-4 rounded-xl font-bold text-lg shadow-lg flex items-center justify-center gap-2 transition-all
                ${validContactsCount >= 1
                            ? "bg-gradient-to-r from-[#004A8D] to-[#00AEEF] text-white hover:shadow-xl hover:-translate-y-1 cursor-pointer"
                            : "bg-gray-200 text-gray-400 cursor-not-allowed"}
            `}
                >
                    {validContactsCount >= 1 ? `Guardar ${validContactsCount} Contactos ➔` : "Agrega al menos uno..."}
                </button>
            </div>
        </div>
    );
}
