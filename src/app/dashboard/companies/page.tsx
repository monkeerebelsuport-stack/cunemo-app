"use client";

import { Building, Plus, Search, Filter, Globe, Calendar, MoreHorizontal, Loader2 } from "lucide-react";
import { useCompanies } from "@/hooks/useCompanies";
import { useEffect, useState } from "react";
import NewCompanyModal from "@/components/companies/NewCompanyModal";

export default function CompaniesPage() {
    const { companies, fetchCompanies, loading } = useCompanies();
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        fetchCompanies();
    }, [fetchCompanies]);

    const filteredCompanies = companies.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.industry?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6 animate-fadeIn h-full flex flex-col">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                        Empresas 🏢
                    </h1>
                    <p className="text-gray-500 mt-2">Gestiona las organizaciones y cuentas clave de tu pipeline.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="btn-primary shadow-lg hover:shadow-xl transition-all"
                >
                    <Plus size={18} /> Nueva Empresa
                </button>
            </div>

            {/* Búsqueda y Filtros */}
            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex gap-4 items-center">
                <div className="relative flex-1">
                    <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Buscar por nombre o industria..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#00AEEF] focus:border-transparent outline-none transition-all text-sm"
                    />
                </div>
                <button className="flex items-center gap-2 px-4 py-2 text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
                    <Filter size={18} />
                    Filtros
                </button>
            </div>

            {/* Listado de Empresas */}
            <div className="flex-1 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
                <div className="grid grid-cols-12 gap-4 p-4 border-b border-gray-100 bg-gray-50/50 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    <div className="col-span-1 flex items-center justify-center">#</div>
                    <div className="col-span-4">Nombre de Empresa</div>
                    <div className="col-span-3">Industria / Web</div>
                    <div className="col-span-3">Fecha Registro</div>
                    <div className="col-span-1 text-right pr-4">Acciones</div>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {loading ? (
                        <div className="flex h-full items-center justify-center p-12">
                            <Loader2 className="w-8 h-8 text-[#00AEEF] animate-spin" />
                        </div>
                    ) : filteredCompanies.length > 0 ? (
                        filteredCompanies.map((company, index) => (
                            <div key={company.id} className="grid grid-cols-12 gap-4 p-4 border-b border-gray-50 hover:bg-gray-50/50 transition-colors items-center group">
                                <div className="col-span-1 flex items-center justify-center">
                                    <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center text-xs font-bold text-gray-400 group-hover:bg-blue-50 group-hover:text-[#00AEEF] transition-colors">
                                        {index + 1}
                                    </div>
                                </div>
                                <div className="col-span-4">
                                    <p className="font-bold text-gray-800 text-sm">{company.name}</p>
                                </div>
                                <div className="col-span-3 space-y-1">
                                    {company.industry && (
                                        <span className="inline-block px-2 py-0.5 bg-gray-100 text-gray-500 rounded text-[10px] font-medium">
                                            {company.industry}
                                        </span>
                                    )}
                                    {company.website && (
                                        <div className="flex items-center gap-1.5 text-[10px] text-blue-500 hover:underline">
                                            <Globe size={10} />
                                            <a href={company.website} target="_blank" rel="noopener noreferrer">
                                                Sitio Web
                                            </a>
                                        </div>
                                    )}
                                </div>
                                <div className="col-span-3 flex items-center gap-2 text-xs text-gray-400">
                                    <Calendar size={14} />
                                    {new Date(company.created_at).toLocaleDateString()}
                                </div>
                                <div className="col-span-1 text-right pr-4">
                                    <button className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors text-gray-400 hover:text-gray-600">
                                        <MoreHorizontal size={18} />
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full p-12 text-center">
                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 text-gray-200">
                                <Building size={32} />
                            </div>
                            <h3 className="text-lg font-bold text-gray-800 mb-1">No hay empresas aún</h3>
                            <p className="text-sm text-gray-400 max-w-xs px-4">
                                Comienza a construir tu base de datos corporativa añadiendo tu primera organización.
                            </p>
                        </div>
                    )}
                </div>
            </div>

            <NewCompanyModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    );
}
