import { create } from "zustand";
import { supabase } from "@/lib/supabase";

export interface Activity {
    id: string;
    subject: string;
    type: 'call' | 'email' | 'meeting' | 'note' | 'task';
    due_date?: string;
    completed_at?: string;
    notes?: string;
    deal_name?: string;
    contact_name?: string;
    created_at: string;
}

interface ActivitiesStore {
    activities: Activity[];
    loading: boolean;
    error: string | null;
    fetchActivities: () => Promise<void>;
    toggleTaskCompletion: (id: string, isCompleted: boolean) => Promise<void>;
}

export const useActivities = create<ActivitiesStore>((set, get) => ({
    activities: [],
    loading: false,
    error: null,

    fetchActivities: async () => {
        set({ loading: true, error: null });
        try {
            const { data, error } = await supabase
                .from("activities")
                .select(`
                    id,
                    subject,
                    type,
                    due_date,
                    completed_at,
                    notes,
                    created_at,
                    deals ( name ),
                    contacts ( first_name, last_name )
                `)
                .order('created_at', { ascending: false });

            if (error) throw error;

            const mapped = (data || []).map((a) => {
                const deal = Array.isArray(a.deals) ? a.deals[0] : a.deals;
                const contact = Array.isArray(a.contacts) ? a.contacts[0] : a.contacts;
                return {
                    ...a,
                    deal_name: deal?.name,
                    contact_name: contact ? `${contact.first_name} ${contact.last_name}` : undefined
                };
            });

            set({ activities: mapped, loading: false });
        } catch (err) {
            if (err instanceof Error) {
                set({ error: err.message, loading: false });
            }
        }
    },

    toggleTaskCompletion: async (id, isCompleted) => {
        try {
            const { error } = await supabase
                .from("activities")
                .update({ completed_at: isCompleted ? new Date().toISOString() : null })
                .eq("id", id);

            if (error) throw error;
            await get().fetchActivities();
        } catch (err) {
            console.error("Error toggling task completion:", err);
        }
    }
}));
