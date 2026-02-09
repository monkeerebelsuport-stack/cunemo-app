import { create } from "zustand";
import { supabase } from "@/lib/supabase";

export interface Contact {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    job_title?: string;
    account_name?: string;
    created_at: string;
}

interface ContactsStore {
    contacts: Contact[];
    loading: boolean;
    error: string | null;
    fetchContacts: () => Promise<void>;
    addContact: (contact: Partial<Contact>) => Promise<void>;
}

export const useContacts = create<ContactsStore>((set, get) => ({
    contacts: [],
    loading: false,
    error: null,

    fetchContacts: async () => {
        set({ loading: true, error: null });
        try {
            const { data, error } = await supabase
                .from("contacts")
                .select(`
                    id,
                    first_name,
                    last_name,
                    email,
                    phone,
                    job_title,
                    created_at,
                    accounts ( name )
                `)
                .order('created_at', { ascending: false });

            if (error) throw error;

            const mapped = (data || []).map((c) => {
                const account = Array.isArray(c.accounts) ? c.accounts[0] : c.accounts;
                return {
                    ...c,
                    account_name: account?.name || "Sin Empresa"
                };
            });

            set({ contacts: mapped, loading: false });
        } catch (err) {
            if (err instanceof Error) {
                set({ error: err.message, loading: false });
            }
        }
    },

    addContact: async (contactData) => {
        set({ loading: true });
        try {
            const { error } = await supabase
                .from("contacts")
                .insert([contactData]);

            if (error) throw error;
            await get().fetchContacts();
        } catch (err) {
            if (err instanceof Error) {
                set({ error: err.message, loading: false });
            }
            throw err;
        }
    }
}));
