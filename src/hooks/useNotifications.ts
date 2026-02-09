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

            // 2. Riesgos de Negocio (> 3 días sin actividad)
            if (prefs.risk_notifications) {
                const threeDaysAgo = new Date();
                threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

                const { data: deals } = await supabase
                    .from('deals')
                    .select('id, title, last_activity_date')
                    .or(`last_activity_date.is.null,last_activity_date.lt.${threeDaysAgo.toISOString()}`)
                    .not('stage', 'in', '(WON,LOST,CLOSED)');

                if (deals) {
                    deals.forEach(deal => {
                        alerts.push({
                            id: `stale-${deal.id}`,
                            title: "¡Negocio Enfriándose! 🔥",
                            message: `El negocio "${deal.title}" no tiene actividad hace más de 3 días.`,
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
