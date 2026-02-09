import { create } from 'zustand';
import { supabase } from '@/lib/supabase';

interface DashboardStats {
    activeDeals: number;
    pipelineValue: number;
    totalContacts: number;
    pendingTasks: number;
    stageDistribution: { name: string; value: number }[];
    loading: boolean;
}

interface DashboardStore extends DashboardStats {
    fetchStats: () => Promise<void>;
}

export const useDashboardStats = create<DashboardStore>((set) => ({
    activeDeals: 0,
    pipelineValue: 0,
    totalContacts: 0,
    pendingTasks: 0,
    stageDistribution: [],
    loading: true,

    fetchStats: async () => {
        try {
            set({ loading: true });

            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("No authenticated user");
            const userId = user.id;

            // 1. Fetch Deals Stats
            const { data: deals, error: dealsError } = await supabase
                .from('deals')
                .select('value, stage')
                .eq('user_id', userId)
                .not('stage', 'in', '(CLOSED,LOST,WON)'); // Corregido: Sin comillas extras adentro

            if (dealsError) throw dealsError;

            const activeDealsCount = deals?.length || 0;
            const totalValue = deals?.reduce((sum, deal) => sum + (deal.value || 0), 0) || 0;

            // 2. Fetch Contacts Count
            const { count: contactsCount, error: contactsError } = await supabase
                .from('contacts')
                .select('*', { count: 'exact', head: true })
                .eq('user_id', userId);

            if (contactsError) throw contactsError;

            // 3. Fetch Pending Tasks Count
            const { count: tasksCount, error: tasksError } = await supabase
                .from('activities')
                .select('*', { count: 'exact', head: true })
                .eq('user_id', userId)
                .eq('type', 'task')
                .is('completed_at', null);

            if (tasksError) throw tasksError;

            // 4. Calculate Stage Distribution
            const distribution = [
                { name: 'Prospectos', value: deals?.filter(d => d.stage === 'LEAD').reduce((s, d) => s + (d.value || 0), 0) || 0 },
                { name: 'Calificados', value: deals?.filter(d => d.stage === 'QUALIFIED').reduce((s, d) => s + (d.value || 0), 0) || 0 },
                { name: 'Propuesta', value: deals?.filter(d => d.stage === 'PROPOSAL').reduce((s, d) => s + (d.value || 0), 0) || 0 },
                { name: 'Negociación', value: deals?.filter(d => d.stage === 'NEGOTIATION').reduce((s, d) => s + (d.value || 0), 0) || 0 }
            ];

            set({
                activeDeals: activeDealsCount,
                pipelineValue: totalValue,
                totalContacts: contactsCount || 0,
                pendingTasks: tasksCount || 0,
                stageDistribution: distribution,
                loading: false
            });

        } catch (error) {
            console.error('Error fetching dashboard stats:', error);
            set({ loading: false });
        }
    }
}));
