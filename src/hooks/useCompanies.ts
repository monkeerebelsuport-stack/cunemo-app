import { create } from "zustand";
import { supabase } from "@/lib/supabase";

export interface Company {
    id: string;
    name: string;
    industry?: string;
    website?: string;
    description?: string;
    created_at: string;
}

interface CompaniesStore {
    companies: Company[];
    loading: boolean;
    error: string | null;
    fetchCompanies: () => Promise<void>;
    addCompany: (company: Partial<Company>) => Promise<void>;
}

export const useCompanies = create<CompaniesStore>((set, get) => ({
    companies: [],
    loading: false,
    error: null,

    fetchCompanies: async () => {
        set({ loading: true, error: null });
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("No authenticated user");
            const userId = user.id;

            const { data, error } = await supabase
                .from("accounts")
                .select("id, name, website, created_at")
                .eq('user_id', userId)
                .order('created_at', { ascending: false });

            if (error) throw error;
            set({ companies: data as Company[], loading: false });
        } catch (err) {
            if (err instanceof Error) {
                set({ error: err.message, loading: false });
            }
        }
    },

    addCompany: async (companyData) => {
        set({ loading: true });
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("No authenticated user");
            const userId = user.id;

            const { error } = await supabase
                .from("accounts")
                .insert([{ ...companyData, user_id: userId }]);

            if (error) throw error;
            await get().fetchCompanies();
        } catch (err) {
            if (err instanceof Error) {
                set({ error: err.message, loading: false });
            }
            throw err;
        }
    }
}));
