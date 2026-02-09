import { create } from "zustand";
import { supabase } from "@/lib/supabase";

export interface Notification {
    id: string;
    title: string;
    message: string;
    type: 'alert' | 'success' | 'info';
    created_at: string;
    is_read: boolean;
    link?: string;
}

interface NotificationsStore {
    notifications: Notification[];
    unreadCount: number;
    loading: boolean;
    fetchNotifications: () => Promise<void>;
    markAsRead: (id: string) => void;
    checkSystemAlerts: () => Promise<void>;
}

export const useNotifications = create<NotificationsStore>((set, get) => ({
    notifications: [],
    unreadCount: 0,
    loading: false,

    fetchNotifications: async () => {
        set({ loading: true });
        await get().checkSystemAlerts();
        set({ loading: false });
    },

    markAsRead: (id) => {
        const updated = get().notifications.map(n =>
            n.id === id ? { ...n, is_read: true } : n
        );
        set({
            notifications: updated,
            unreadCount: updated.filter(n => !n.is_read).length
        });
    },

    checkSystemAlerts: async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            const prefs = user?.user_metadata?.notification_prefs || {
                platform_alerts: true,
                risk_notifications: true,
                task_reminders: true
            };

            // 1. Si las alertas en plataforma están apagadas globalmente, limpiamos y salimos
            if (!prefs.platform_alerts) {
                set({ notifications: [], unreadCount: 0 });
                return;
            }

            const alerts: Notification[] = [];

            // 2. Riesgos de Negocio (Ejemplo: Negocios estancados o con valor alto)
            if (prefs.risk_notifications) {
                const { data: deals } = await supabase
                    .from('deals')
                    .select('id, name, value')
                    .eq('user_id', user.id) // Blindaje
                    .not('stage', 'in', '(WON,LOST,CLOSED)');

                if (deals) {
                    deals.forEach(deal => {
                        // Por ahora una alerta simple de seguimiento para todos los activos si no hay fecha real
                        alerts.push({
                            id: `stale-${deal.id}`,
                            title: "Seguimiento Requerido 💎",
                            message: `El negocio "${deal.name}" requiere una acción para avanzar.`,
                            type: 'alert',
                            created_at: new Date().toISOString(),
                            is_read: false,
                            link: `/dashboard/deals/${deal.id}`
                        });
                    });
                }
            }

            // 3. Tareas Próximas (vencen hoy o mañana)
            if (prefs.task_reminders) {
                const tomorrow = new Date();
                tomorrow.setDate(tomorrow.getDate() + 1);

                const { data: activities } = await supabase
                    .from('activities')
                    .select('id, subject, due_date')
                    .eq('user_id', user.id) // Blindaje
                    .eq('type', 'task')
                    .is('completed_at', null)
                    .lte('due_date', tomorrow.toISOString());

                if (activities) {
                    activities.forEach(task => {
                        alerts.push({
                            id: `task-${task.id}`,
                            title: "Tarea Próxima ⏰",
                            message: `Tienes pendiente: ${task.subject}`,
                            type: 'info',
                            created_at: new Date().toISOString(),
                            is_read: false,
                            link: '/dashboard/activities'
                        });
                    });
                }
            }

            // Actualizamos el estado global
            set({
                notifications: alerts,
                unreadCount: alerts.length
            });
        } catch (err) {
            console.error("Error checking system alerts:", err);
        }
    }
}));
