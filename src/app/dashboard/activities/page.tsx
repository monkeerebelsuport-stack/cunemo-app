"use client";
export const dynamic = 'force-dynamic';

import { Calendar, CheckCircle, Loader2 } from "lucide-react";
import { useActivities } from "@/hooks/useActivities";
import { useEffect } from "react";

export default function ActivitiesPage() {
    const { activities, fetchActivities, loading, toggleTaskCompletion } = useActivities();

    useEffect(() => {
        fetchActivities();
    }, [fetchActivities]);

    const meetings = activities.filter(a => a.type === 'meeting' && !a.completed_at);
    const pendingTasks = activities.filter(a => a.type === 'task' && !a.completed_at);

    return (
        <div className="h-full flex flex-col space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                        Actividades
                    </h1>
                    <p className="text-gray-500 text-sm">Calendario de llamadas, reuniones y tareas pendientes</p>
                </div>
                <button className="btn-primary shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all">
                    <span>+ Agendar Actividad</span>
                </button>
            </div>

            {loading ? (
                <div className="flex-1 flex items-center justify-center">
                    <Loader2 className="w-8 h-8 text-[#00AEEF] animate-spin" />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Left: Meetings */}
                    <div className="col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm flex flex-col">
                        <div className="p-6 border-b border-gray-50">
                            <h3 className="font-bold text-gray-700 flex items-center gap-2">
                                <Calendar className="text-blue-500" size={20} />
                                Próximas Reuniones
                            </h3>
                        </div>
                        <div className="p-6 flex-1">
                            {meetings.length > 0 ? (
                                <div className="space-y-4">
                                    {meetings.map((meeting) => (
                                        <div key={meeting.id} className="p-4 bg-blue-50/30 border border-blue-50 rounded-xl flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-blue-500 shadow-sm">
                                                    <Calendar size={20} />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-800">{meeting.subject}</p>
                                                    <p className="text-xs text-gray-500">
                                                        {meeting.due_date ? new Date(meeting.due_date).toLocaleString() : "Sin fecha"} • {meeting.deal_name || "Sin negocio"}
                                                    </p>
                                                </div>
                                            </div>
                                            <button className="text-sm text-blue-600 font-medium hover:underline">Ver detalles</button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full text-center p-12 opacity-40">
                                    <Calendar size={40} className="mb-2" />
                                    <p className="text-sm">No hay reuniones programadas.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right: Tasks */}
                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm flex flex-col">
                        <div className="p-6 border-b border-gray-50">
                            <h3 className="font-bold text-gray-700 flex items-center gap-2">
                                <CheckCircle className="text-green-500" size={20} />
                                Tareas Pendientes
                            </h3>
                        </div>
                        <div className="p-6 flex-1">
                            {pendingTasks.length > 0 ? (
                                <div className="space-y-3">
                                    {pendingTasks.map((task) => (
                                        <div key={task.id} className="group p-3 bg-gray-50 hover:bg-white border border-transparent hover:border-gray-100 rounded-lg flex items-start gap-3 transition-all">
                                            <button
                                                onClick={() => toggleTaskCompletion(task.id, true)}
                                                className="w-5 h-5 mt-0.5 rounded-full border-2 border-gray-200 group-hover:border-green-400 transition-colors"
                                            />
                                            <div className="flex-1">
                                                <p className="text-sm font-medium text-gray-800">{task.subject}</p>
                                                {task.due_date && (
                                                    <p className="text-[10px] text-orange-500 font-bold uppercase mt-1">
                                                        Vence: {new Date(task.due_date).toLocaleDateString()}
                                                    </p>
                                                )}
                                                <p className="text-[10px] text-gray-400 mt-1 line-clamp-1">{task.deal_name}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full text-center opacity-40">
                                    <CheckCircle size={32} className="mb-2" />
                                    <p className="text-sm">Todo al día.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
