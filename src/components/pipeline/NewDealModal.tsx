import { useState, useEffect } from "react";
import { usePipeline } from "@/hooks/usePipeline";
import { useContacts } from "@/hooks/useContacts";
import Modal from "@/components/ui/Modal";

interface NewDealModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function NewDealModal({ isOpen, onClose }: NewDealModalProps) {
    const [loading, setLoading] = useState(false);
    const [displayValue, setDisplayValue] = useState(0);
    const { addDeal } = usePipeline();
    const { contacts, fetchContacts } = useContacts();

    useEffect(() => {
        if (isOpen) {
            fetchContacts();
        }
    }, [isOpen, fetchContacts]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        const name = formData.get("title") as string;
        const value = parseFloat(formData.get("value") as string);
        const probability = parseInt(formData.get("probability") as string);
        const contactId = formData.get("contact_id") as string;

        try {
            await addDeal({
                name,
                value,
                probability,
                stage: "LEAD",
                contact_id: contactId || undefined
            });
            onClose();
        } catch {
            alert("Error al crear el negocio");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Nuevo Negocio">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Título del Negocio</label>
                    <input
                        name="title"
                        type="text"
                        required
                        placeholder="Ej: Licencias CRM Enterprise"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00AEEF] focus:border-transparent outline-none transition-all placeholder:text-gray-300"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Contacto del Negocio</label>
                    <select
                        name="contact_id"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00AEEF] outline-none transition-all text-sm"
                    >
                        <option value="">-- Seleccionar Contacto --</option>
                        {contacts.map(c => (
                            <option key={c.id} value={c.id}>
                                {c.first_name} {c.last_name} ({c.email})
                            </option>
                        ))}
                    </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Valor Estimado ($)</label>
                        <input
                            name="value"
                            type="number"
                            min="0"
                            step="any"
                            required
                            placeholder="0.00"
                            onChange={(e) => setDisplayValue(parseFloat(e.target.value) || 0)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00AEEF] focus:border-transparent outline-none transition-all"
                        />
                        {displayValue > 0 && (
                            <p className="text-[10px] text-[#00AEEF] font-bold mt-1 animate-fadeIn">
                                El CRM guardará: ${displayValue.toLocaleString('es-CL')}
                            </p>
                        )}
                        <p className="text-[9px] text-gray-400 mt-1">Escribe solo números (ej: 3000 para tres mil)</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Probabilidad (%)</label>
                        <select name="probability" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00AEEF] outline-none">
                            <option value="20">20% (Prospecto)</option>
                            <option value="50">50% (Propuesta)</option>
                            <option value="80">80% (Negociación)</option>
                        </select>
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
                        {loading ? "Creando..." : "Crear Negocio"}
                    </button>
                </div>
            </form>
        </Modal>
    );
}
