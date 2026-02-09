"use client";
export const dynamic = 'force-dynamic';

import { Search, Plus, Filter, MoreHorizontal, Mail, Phone, Loader2 } from "lucide-react";
import { useContacts } from "@/hooks/useContacts";
import { useEffect, useState } from "react";
import NewContactModal from "@/components/contacts/NewContactModal";

export default function ContactsPage() {
    const { contacts, fetchContacts, loading } = useContacts();
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        fetchContacts();
    }, [fetchContacts]);

    const filteredContacts = contacts.filter(c =>
        `${c.first_name} ${c.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.account_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="h-full flex flex-col space-y-6">
            {/* Header & Actions */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                        Contactos
                    </h1>
                    <p className="text-gray-500 text-sm">Gestiona tu base de datos de clientes y prospectos</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="btn-primary shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
                >
                    <Plus size={20} />
                    <span>Nuevo Contacto</span>
                </button>
            </div>

            {/* Filters & Search Bar */}
            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex gap-4 items-center">
                <div className="relative flex-1">
                    <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Buscar por nombre, empresa o correo..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#00AEEF] focus:border-transparent outline-none transition-all placeholder-gray-400 text-sm"
                    />
                </div>
                <button className="flex items-center gap-2 px-4 py-2 text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
                    <Filter size={18} />
                    Filtros
                </button>
            </div>

            {/* Contacts Table */}
            <div className="flex-1 bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
                {/* Table Header */}
                <div className="grid grid-cols-12 gap-4 p-4 border-b border-gray-100 bg-gray-50/50 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    <div className="col-span-4 pl-4">Nombre / Empresa</div>
                    <div className="col-span-3">Contacto</div>
                    <div className="col-span-2">Cargo</div>
                    <div className="col-span-2">Creado el</div>
                    <div className="col-span-1 text-right pr-4">Acciones</div>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {loading ? (
                        <div className="flex h-full items-center justify-center p-12">
                            <Loader2 className="w-8 h-8 text-[#00AEEF] animate-spin" />
                        </div>
                    ) : filteredContacts.length > 0 ? (
                        filteredContacts.map((contact) => (
                            <div key={contact.id} className="grid grid-cols-12 gap-4 p-4 border-b border-gray-50 hover:bg-gray-50/50 transition-colors items-center">
                                <div className="col-span-4 pl-4">
                                    <p className="font-bold text-gray-800 text-sm">{contact.first_name} {contact.last_name}</p>
                                    <p className="text-xs text-gray-400">{contact.account_name}</p>
                                </div>
                                <div className="col-span-3 flex flex-col gap-1">
                                    {contact.email && <div className="flex items-center gap-1.5 text-xs text-gray-500 truncate"><Mail size={12} /> {contact.email}</div>}
                                    {contact.phone && <div className="flex items-center gap-1.5 text-xs text-gray-500"><Phone size={12} /> {contact.phone}</div>}
                                </div>
                                <div className="col-span-2 text-sm text-gray-600">
                                    {contact.job_title || "-"}
                                </div>
                                <div className="col-span-2 text-xs text-gray-400">
                                    {new Date(contact.created_at).toLocaleDateString()}
                                </div>
                                <div className="col-span-1 text-right pr-4">
                                    <button className="p-1 hover:bg-gray-100 rounded-md transition-colors text-gray-400 hover:text-gray-600">
                                        <MoreHorizontal size={18} />
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center text-center p-12 h-full">
                            <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                                <div className="text-4xl">👥</div>
                            </div>
                            <h3 className="text-lg font-bold text-gray-800 mb-2">No se encontraron contactos</h3>
                            <p className="text-gray-500 max-w-sm mb-6">
                                {searchTerm ? "Ajusta tu búsqueda para encontrar lo que necesitas." : "Tu base de datos está vacía. Agrega tu primer contacto."}
                            </p>
                        </div>
                    )}
                </div>
            </div>
            <NewContactModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </div>
    );
}
