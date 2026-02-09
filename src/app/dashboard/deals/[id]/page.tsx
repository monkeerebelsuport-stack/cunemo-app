"use client";

import { useEffect, useState } from "react";
import { useDeal } from "@/hooks/useDeal";
import ActivityModal from "@/components/deals/ActivityModal";
import EditDealModal from "@/components/deals/EditDealModal";
import { ActivityType } from "@/types/pipeline";
import { ArrowLeft, Edit2, Phone, Mail, FileText, Calendar, DollarSign, Building } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function DealDetailPage() {
    const params = useParams();
    const { deal, activities, loading, error, fetchDeal } = useDeal();
    const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [activityType, setActivityType] = useState<ActivityType>("call");

    // Inline Editing States
    const [isEditingValue, setIsEditingValue] = useState(false);
    const [isEditingProbability, setIsEditingProbability] = useState(false);
    const [tempValue, setTempValue] = useState("");
    const [tempProb, setTempProb] = useState("");

    const dealId = params.id as string;

    useEffect(() => {
        if (dealId) {
            fetchDeal(dealId);
        }
    }, [dealId, fetchDeal]);

    const openActivityModal = (type: ActivityType) => {
        setActivityType(type);
        setIsActivityModalOpen(true);
    };

    const { updateDeal } = useDeal();

    const handleSaveValue = async () => {
        if (!deal) return;
        const numValue = parseFloat(tempValue);
        if (!isNaN(numValue) && numValue !== deal.value) {
            await updateDeal(deal.id, { value: numValue });
        }
        setIsEditingValue(false);
    };

    const handleSaveProb = async () => {
        if (!deal) return;
        const numProb = parseInt(tempProb);
        if (!isNaN(numProb) && numProb >= 0 && numProb <= 100 && numProb !== deal.probability) {
            await updateDeal(deal.id, { probability: numProb });
        }
        setIsEditingProbability(false);
    };

    if (loading) return (
        <div className="h-full flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-[#00AEEF] border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    if (error || !deal) return (
        <div className="p-8 text-center text-gray-500">
            <p>No se encontró el negocio o hubo un error.</p>
            <Link href="/dashboard/deals" className="text-blue-500 hover:underline mt-2 inline-block">Volver al tablero</Link>
        </div>
    );

    return (
        <div className="max-w-5xl mx-auto space-y-6 pb-12 animate-fadeIn">
            <ActivityModal
                isOpen={isActivityModalOpen}
                onClose={() => setIsActivityModalOpen(false)}
                dealId={deal.id}
                initialType={activityType}
            />

            {deal && (
                <EditDealModal
                    isOpen={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                    deal={deal}
                />
            )}

            {/* Header / Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                <Link href="/dashboard/deals" className="hover:text-gray-600 flex items-center gap-1">
                    <ArrowLeft size={14} /> Negocios
                </Link>
                <span>/</span>
                <span className="text-gray-600 font-medium truncate max-w-[200px]">{deal.title}</span>
            </div>

            {/* Main Header Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 relative overflow-hidden">
                <div className="relative z-10 flex justify-between items-start">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <span className="bg-blue-50 text-blue-600 text-xs font-bold px-2 py-1 rounded-md uppercase tracking-wide">
                                {deal.stageId}
                            </span>
                            <span className="text-gray-400 text-sm flex items-center gap-1">
                                <Building size={14} /> {deal.companyName}
                            </span>
                        </div>
                        <h1 className="text-3xl font-bold text-gray-800 mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                            {deal.title}
                        </h1>
                        <div className="flex gap-4">
                            <button
                                onClick={() => openActivityModal("call")}
                                className="flex items-center gap-2 px-4 py-2 bg-[#00AEEF] text-white rounded-lg font-medium shadow-md shadow-blue-200 hover:bg-[#009bd6] transition-colors"
                            >
                                <Phone size={18} /> Llamar
                            </button>
                            <button
                                onClick={() => openActivityModal("email")}
                                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                            >
                                <Mail size={18} /> Email
                            </button>
                            <div className="h-10 w-px bg-gray-100 mx-2" />
                            {deal.stageId !== 'WON' && deal.stageId !== 'LOST' && (
                                <>
                                    <button
                                        onClick={async () => {
                                            await updateDeal(deal.id, { stage: 'WON', probability: 100 });
                                        }}
                                        className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg font-medium shadow-md shadow-green-100 hover:bg-green-600 transition-colors"
                                    >
                                        Gané este negocio 🏆
                                    </button>
                                    <button
                                        onClick={async () => {
                                            await updateDeal(deal.id, { stage: 'LOST', probability: 0 });
                                        }}
                                        className="flex items-center gap-2 px-4 py-2 border border-red-200 text-red-600 rounded-lg font-medium hover:bg-red-50 transition-colors"
                                    >
                                        Lo perdí ❌
                                    </button>
                                </>
                            )}
                            {deal.stageId === 'WON' && (
                                <div className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-lg font-bold border border-green-200">
                                    ¡Oportunidad Ganada! 🏆
                                </div>
                            )}
                            {deal.stageId === 'LOST' && (
                                <div className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 rounded-lg font-bold border border-red-200">
                                    Oportunidad Perdida ❌
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="flex items-center justify-end gap-2 text-gray-400 mb-1 text-sm font-medium">
                            <DollarSign size={16} /> Valor Estimado
                        </div>

                        {isEditingValue ? (
                            <input
                                type="number"
                                value={tempValue}
                                onChange={(e) => setTempValue(e.target.value)}
                                onBlur={handleSaveValue}
                                onKeyDown={(e) => e.key === 'Enter' && handleSaveValue()}
                                className="text-4xl font-bold text-gray-800 tracking-tight text-right w-full bg-blue-50/50 border-b-2 border-blue-500 outline-none px-2 rounded-t-lg"
                                autoFocus
                            />
                        ) : (
                            <div
                                onClick={() => {
                                    setTempValue(deal.value.toString());
                                    setIsEditingValue(true);
                                }}
                                className="text-4xl font-bold text-gray-800 tracking-tight cursor-pointer hover:bg-gray-50 px-2 rounded-lg transition-colors border-b-2 border-transparent hover:border-gray-200"
                            >
                                {deal.currency}{deal.value.toLocaleString()}
                            </div>
                        )}

                        <div className="text-sm text-gray-400 mt-2 flex items-center justify-end gap-1">
                            Probabilidad:
                            {isEditingProbability ? (
                                <div className="flex items-center gap-1">
                                    <input
                                        type="number"
                                        min="0"
                                        max="100"
                                        value={tempProb}
                                        onChange={(e) => setTempProb(e.target.value)}
                                        onBlur={handleSaveProb}
                                        onKeyDown={(e) => e.key === 'Enter' && handleSaveProb()}
                                        className="w-16 font-bold text-green-500 bg-green-50/50 border-b-2 border-green-500 outline-none text-right px-1"
                                        autoFocus
                                    />
                                    <span className="font-bold text-green-500">%</span>
                                </div>
                            ) : (
                                <span
                                    onClick={() => {
                                        setTempProb(deal.probability.toString());
                                        setIsEditingProbability(true);
                                    }}
                                    className="font-bold text-green-500 cursor-pointer hover:bg-green-50 px-1 rounded transition-colors border-b border-transparent hover:border-green-200"
                                >
                                    {deal.probability}%
                                </span>
                            )}
                        </div>
                    </div>
                </div>
                {/* Decorative Background */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-gray-50 to-blue-50/50 rounded-bl-full -z-0 opacity-50" />
            </div>

            <div className="grid grid-cols-3 gap-6">
                {/* Left Column: Timeline */}
                <div className="col-span-2 space-y-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 min-h-[400px]">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-gray-800 text-lg">Línea de Tiempo</h3>
                            <button
                                onClick={() => openActivityModal("note")}
                                className="text-sm text-[#00AEEF] font-medium hover:underline"
                            >
                                + Nueva Actividad
                            </button>
                        </div>

                        <div className="relative border-l-2 border-gray-100 ml-3 space-y-8 pl-8 py-2">
                            {/* Render Activities */}
                            {activities && activities.length > 0 ? (
                                activities.map((activity) => (
                                    <div key={activity.id} className="relative">
                                        <div className="absolute -left-[39px] w-6 h-6 bg-blue-100 rounded-full border-2 border-white flex items-center justify-center text-blue-600">
                                            {activity.type === 'call' && <Phone size={12} />}
                                            {activity.type === 'email' && <Mail size={12} />}
                                            {activity.type === 'meeting' && <Calendar size={12} />}
                                            {activity.type === 'note' && <FileText size={12} />}
                                        </div>
                                        <p className="text-xs text-gray-400 mb-1">
                                            {new Date(activity.created_at).toLocaleString()}
                                        </p>
                                        <p className="text-gray-800 font-medium">{activity.subject}</p>
                                        {activity.notes && (
                                            <p className="text-sm text-gray-500 mt-1 bg-gray-50 p-2 rounded-md">{activity.notes}</p>
                                        )}
                                    </div>
                                ))
                            ) : null}

                            {/* Initial Event: Deal Created */}
                            <div className="relative">
                                <div className="absolute -left-[39px] w-6 h-6 bg-green-100 rounded-full border-2 border-white flex items-center justify-center">
                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                </div>
                                <p className="text-xs text-gray-400 mb-1">
                                    {deal?.created_at ? new Date(deal.created_at).toLocaleString() : "Fecha desconocida"}
                                </p>
                                <p className="text-gray-800 font-medium">Negocio creado</p>
                            </div>

                            {(!activities || activities.length === 0) && (
                                <div className="relative opacity-50">
                                    <div className="absolute -left-[39px] w-6 h-6 bg-gray-100 rounded-full border-2 border-white flex items-center justify-center">
                                        <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                                    </div>
                                    <p className="text-gray-400 font-medium italic">No hay más actividades registradas.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Column: Properties */}
                <div className="space-y-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-gray-800">Detalles</h3>
                            <button
                                onClick={() => setIsEditModalOpen(true)}
                                className="text-[#00AEEF] hover:bg-blue-50 p-1 rounded-md transition-colors"
                            >
                                <Edit2 size={16} />
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Cierre Esperado</label>
                                <p className="text-gray-800 font-medium mt-1">
                                    {deal.expectedCloseDate ? new Date(deal.expectedCloseDate).toLocaleDateString() : "No definido"}
                                </p>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Propietario</label>
                                <div className="flex items-center gap-2 mt-1">
                                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs font-bold text-blue-600">You</div>
                                    <p className="text-gray-800 font-medium">Usuario</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
