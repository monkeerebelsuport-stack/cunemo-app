import { create } from "zustand";
import { supabase } from "@/lib/supabase";
import { Deal, Activity, DealStage, ActivityType } from "@/types/pipeline";

interface DealDetailState {
    deal: Deal | null;
    activities: Activity[];
    loading: boolean;
    error: string | null;
    fetchDeal: (id: string) => Promise<void>;
    addActivity: (data: { deal_id: string; type: string; subject: string; notes?: string }) => Promise<void>;
    updateDeal: (id: string, updates: DealUpdateDTO) => Promise<void>;
}

interface DealUpdateDTO {
    name?: string;
    value?: number;
    probability?: number;
    expected_close_date?: string;
    stage?: string;
}

export const useDeal = create<DealDetailState>((set) => ({
    deal: null,
    loading: false,
    error: null,
    activities: [],

    fetchDeal: async (id: string) => {
        set({ loading: true, error: null });
        try {
            const { data, error } = await supabase
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
                    activities (
                        id,
                        subject,
                        type,
                        created_at,
                        notes
                    )
                `)
                .eq("id", id)
                .single();

            if (error) throw error;

            const deal: Deal = {
                id: data.id,
                title: data.name,
                companyName: (data.accounts as { name?: string })?.name || "Sin Empresa",
                value: data.value,
                currency: "$",
                probability: data.probability,
                expectedCloseDate: data.expected_close_date,
                created_at: data.created_at, // Add this
                stageId: data.stage as DealStage,
            };

            // Process activities
            // Ensure activities is an array and sort by date descending
            const rawActivities = data.activities || [];
            const sortedActivities = rawActivities.sort((a: { created_at: string }, b: { created_at: string }) =>
                new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
            );

            // Add "Deal Created" as the initial activity if not present
            // Or better, let the UI handle the "Start" point. 
            // We will store just the fetched activities here.

            set({ deal, activities: sortedActivities, loading: false });

        } catch (err) {
            console.error("Error fetching deal:", err);
            if (err instanceof Error) {
                set({ error: err.message, loading: false });
            }
        }
    },
    addActivity: async (activityData: { deal_id: string; type: string; subject: string; notes?: string }) => {
        try {
            // 1. Insert into DB
            const { data, error } = await supabase
                .from("activities")
                .insert([{
                    ...activityData,
                    created_at: new Date().toISOString() // Client-side timestamp for immediate feel, DB handles true time
                }])
                .select()
                .single();

            if (error) throw error;

            // 2. Update Local State
            // Cast response to Activity
            const newActivity: Activity = {
                id: data.id,
                subject: data.subject,
                type: data.type as ActivityType,
                created_at: data.created_at,
                notes: data.notes
            };

            set((state) => ({
                activities: [newActivity, ...state.activities]
            }));

        } catch (err) {
            console.error("Error adding activity:", err);
            throw err;
        }
    },
    updateDeal: async (id: string, updates: DealUpdateDTO) => {
        try {
            const { error } = await supabase
                .from("deals")
                .update(updates)
                .eq("id", id);

            if (error) throw error;

            // Update Local State
            set((state) => {
                if (!state.deal) return state;
                return {
                    deal: {
                        ...state.deal,
                        title: updates.name ?? state.deal.title,
                        value: updates.value ?? state.deal.value,
                        probability: updates.probability ?? state.deal.probability,
                        expectedCloseDate: updates.expected_close_date ?? state.deal.expectedCloseDate,
                    }
                };
            });

        } catch (err) {
            console.error("Error updating deal:", err);
            throw err;
        }
    }
}));
