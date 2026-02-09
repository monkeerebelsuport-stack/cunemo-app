import { create } from "zustand";
import { supabase } from "@/lib/supabase";
import { Deal, DealStage, PipelineState, KanbanColumn } from "@/types/pipeline";

interface PipelineStore {
    state: PipelineState;
    loading: boolean;
    error: string | null;
    fetchDeals: () => Promise<void>;
    addDeal: (dealData: { name: string, value: number, probability: number, stage: DealStage, account_id?: string, contact_id?: string }) => Promise<void>;
    updateDealStage: (dealId: string, newStage: DealStage) => Promise<void>;

}

const initialColumns: Record<DealStage, KanbanColumn> = {
    LEAD: { id: "LEAD", title: "Prospectos", color: "#64748B", deals: [], totalValue: 0 },
    QUALIFIED: { id: "QUALIFIED", title: "Calificados", color: "#3B82F6", deals: [], totalValue: 0 },
    PROPOSAL: { id: "PROPOSAL", title: "Propuesta", color: "#F59E0B", deals: [], totalValue: 0 },
    NEGOTIATION: { id: "NEGOTIATION", title: "Negociación", color: "#8B5CF6", deals: [], totalValue: 0 },
    CLOSED: { id: "CLOSED", title: "Cerrados", color: "#94A3B8", deals: [], totalValue: 0 },
    WON: { id: "WON", title: "Ganados 🏆", color: "#10B981", deals: [], totalValue: 0 },
    LOST: { id: "LOST", title: "Perdidos ❌", color: "#EF4444", deals: [], totalValue: 0 },
};

export const usePipeline = create<PipelineStore>((set, get) => ({
    state: {
        columnOrder: ["LEAD", "QUALIFIED", "PROPOSAL", "NEGOTIATION", "WON", "LOST"],
        columns: initialColumns,
    },
    loading: false,
    error: null,

    fetchDeals: async () => {
        set({ loading: true, error: null });
        try {
            const { data: deals, error } = await supabase
                .from("deals")
                .select(`
          id,
          name,
          value,
          stage,
          probability,
          expected_close_date,
          created_at,
          accounts ( name ),
          contacts ( email ),
          activities ( created_at )
        `);

            if (error) throw error;

            // Transform raw data to PipelineState
            const newColumns = { ...initialColumns };
            // Reset deals in each column to avoid accumulation
            Object.keys(newColumns).forEach(key => {
                newColumns[key as DealStage] = { ...newColumns[key as DealStage], deals: [], totalValue: 0 };
            });

            deals?.forEach((d) => {
                const deal: Deal = {
                    id: d.id,
                    title: d.name,
                    companyName: (d.accounts as { name?: string } | null)?.name || "Sin Empresa",
                    value: d.value,
                    currency: "$", // TODO: Multi-currency support
                    probability: d.probability,
                    expectedCloseDate: d.expected_close_date,
                    created_at: d.created_at,
                    stageId: d.stage as DealStage,
                };

                // Determine last activity date
                const activityDates = (d.activities || []).map((a: { created_at: string }) => new Date(a.created_at).getTime());
                const dealCreatedAt = new Date(d.created_at).getTime();
                const latest = Math.max(dealCreatedAt, ...activityDates);
                deal.lastActivityDate = new Date(latest).toISOString();

                if (newColumns[deal.stageId]) {
                    newColumns[deal.stageId].deals.push(deal);
                }
            });

            // Recalculate totals
            Object.keys(newColumns).forEach((key) => {
                const col = newColumns[key as DealStage];
                col.totalValue = col.deals.reduce((sum: number, d: Deal) => sum + d.value, 0);
            });

            set({
                state: { ...get().state, columns: newColumns },
                loading: false,
            });

        } catch (err) {
            console.error("Error fetching deals:", err);
            if (err instanceof Error) {
                set({ error: err.message, loading: false });
            }
        }
    },

    addDeal: async (dealData) => {
        set({ loading: true, error: null });
        try {
            const { error } = await supabase
                .from("deals")
                .insert([dealData]);

            if (error) throw error;

            // Recargar datos para ver el nuevo negocio
            await get().fetchDeals();

        } catch (err) {
            console.error("Error creating deal:", err);
            if (err instanceof Error) {
                set({ error: err.message, loading: false });
            }
            throw err;
        }
    },



    updateDealStage: async (dealId: string, newStage: DealStage) => {
        const previousState = get().state;

        // 1. Clonado ligero y eficiente (Optimistic Update)
        const updatedColumns = { ...previousState.columns };
        let dealToMove: Deal | undefined;
        let sourceStage: DealStage | undefined;

        // Búsqueda eficiente del deal
        for (const stageKey in updatedColumns) {
            const stage = stageKey as DealStage;
            const deals = updatedColumns[stage].deals;
            const dealIndex = deals.findIndex(d => d.id === dealId);

            if (dealIndex !== -1) {
                dealToMove = { ...deals[dealIndex], stageId: newStage };
                sourceStage = stage;

                // Actualización inmutable de columnas
                updatedColumns[stage] = {
                    ...updatedColumns[stage],
                    deals: deals.filter(d => d.id !== dealId),
                    totalValue: updatedColumns[stage].totalValue - deals[dealIndex].value
                };
                break;
            }
        }

        if (!dealToMove || !sourceStage) return;

        // Añadir a destino
        updatedColumns[newStage] = {
            ...updatedColumns[newStage],
            deals: [...updatedColumns[newStage].deals, dealToMove],
            totalValue: updatedColumns[newStage].totalValue + dealToMove.value
        };

        // 2. SET INMEDIATO: UX Fluida
        set({ state: { ...previousState, columns: updatedColumns } });

        // 3. PROCESOS DE FONDO (Fire and Forget)
        // No usamos 'await' aquí para que la función retorne al instante
        const runAutomations = async () => {
            try {
                // Sincronizar con DB
                const { error: dbError } = await supabase
                    .from("deals")
                    .update({ stage: newStage })
                    .eq("id", dealId);

                if (dbError) throw dbError;

                // Reglas de Auto-Tasking
                if (newStage === 'QUALIFIED' || newStage === 'WON') {
                    const subject = newStage === 'QUALIFIED'
                        ? '📞 Llamada de Seguimiento: Definir requerimientos'
                        : '🎉 Bienvenida: Iniciar proceso de onboarding';

                    const days = newStage === 'QUALIFIED' ? 2 : 1;

                    await supabase.from('activities').insert([{
                        deal_id: dealId,
                        type: 'task',
                        subject,
                        due_date: new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString(),
                    }]);
                }

                // Automatización de Email
                if (newStage === 'PROPOSAL' || newStage === 'WON') {
                    const { data: contactData } = await supabase
                        .from('deals')
                        .select('contacts ( email, first_name )')
                        .eq('id', dealId)
                        .single();

                    const contact = (contactData as { contacts?: { email?: string; first_name?: string } })?.contacts;
                    if (contact?.email) {
                        const subject = newStage === 'PROPOSAL'
                            ? 'Propuesta Comercial: CunemoClient 💎'
                            : '¡Felicidades! Bienvenido a la familia Cunemo 🎉';

                        const message = newStage === 'PROPOSAL'
                            ? `Hola ${contact.first_name || 'Cliente'}, hemos preparado una propuesta personalizada para ti.`
                            : `Hola ${contact.first_name || 'Cliente'}, es un placer tenerte a bordo.`;

                        fetch('/api/email/send', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                to: contact.email,
                                subject,
                                html: `<div style="font-family: sans-serif; padding: 20px;"><h2>CunemoClient</h2><p>${message}</p></div>`
                            })
                        }).catch(e => console.error("Fondo: Error Email", e));
                    }
                }
            } catch (err) {
                console.error("Fallo en procesos de fondo:", err);
                // En caso de error crítico de DB, podríamos re-notificar o refrescar
            }
        };

        runAutomations(); // Se ejecuta en paralelo
    }
}));
