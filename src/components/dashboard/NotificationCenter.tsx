"use client";

import { useEffect, useState, useRef } from "react";
import { useNotifications } from "@/hooks/useNotifications";
import { Bell, AlertCircle, Info, ExternalLink, X } from "lucide-react";
import Link from "next/link";

export default function NotificationCenter() {
    const [isOpen, setIsOpen] = useState(false);
    const { notifications, unreadCount, fetchNotifications, markAsRead, loading } = useNotifications();
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetchNotifications();
        // Polling para alertas cada 2 minutos
        const interval = setInterval(fetchNotifications, 120000);
        return () => clearInterval(interval);
    }, [fetchNotifications]);

    // Cerrar al hacer clic fuera
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Bell Icon Button */}
            <button
                id="notification-bell"
                onClick={() => setIsOpen(!isOpen)}
                className={`
                    p-2 rounded-full transition-all relative
                    ${isOpen ? "bg-blue-50 text-blue-600 shadow-inner" : "text-gray-400 hover:bg-gray-100"}
                `}
            >
                <Bell size={22} className={unreadCount > 0 ? "animate-swing" : ""} />
                {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                        {unreadCount}
                    </span>
                )}
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden animate-slideDown">
                    <div className="p-4 border-b border-gray-50 flex items-center justify-between bg-white sticky top-0">
                        <h3 className="font-bold text-gray-800 flex items-center gap-2">
                            Notificaciones
                            {unreadCount > 0 && (
                                <span className="bg-blue-100 text-blue-600 text-[10px] px-2 py-0.5 rounded-full">
                                    {unreadCount} nuevas
                                </span>
                            )}
                        </h3>
                        <button onClick={() => setIsOpen(false)} className="text-gray-300 hover:text-gray-500">
                            <X size={18} />
                        </button>
                    </div>

                    <div className="max-h-[400px] overflow-y-auto">
                        {loading && notifications.length === 0 ? (
                            <div className="p-8 text-center text-gray-400">
                                <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                                <p className="text-xs">Buscando alertas...</p>
                            </div>
                        ) : notifications.length > 0 ? (
                            <div className="divide-y divide-gray-50">
                                {notifications.map((notif) => (
                                    <div
                                        key={notif.id}
                                        onClick={() => markAsRead(notif.id)}
                                        className={`
                                            p-4 transition-colors cursor-pointer group relative
                                            ${notif.is_read ? "opacity-70 bg-white" : "bg-blue-50/20 hover:bg-blue-50/40"}
                                        `}
                                    >
                                        <div className="flex gap-3">
                                            <div className={`
                                                mt-1 w-8 h-8 rounded-lg flex items-center justify-center
                                                ${notif.type === 'alert' ? "bg-red-50 text-red-500" : "bg-blue-50 text-blue-500"}
                                            `}>
                                                {notif.type === 'alert' ? <AlertCircle size={16} /> : <Info size={16} />}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-bold text-gray-800 leading-tight">
                                                    {notif.title}
                                                </p>
                                                <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                                                    {notif.message}
                                                </p>
                                                <div className="flex items-center justify-between mt-2">
                                                    <span className="text-[10px] text-gray-400">
                                                        {new Date(notif.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                    {notif.link && (
                                                        <Link
                                                            href={notif.link}
                                                            className="text-[10px] text-blue-600 font-bold flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                                        >
                                                            Ver <ExternalLink size={10} />
                                                        </Link>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-12 text-center">
                                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Bell size={24} className="text-gray-300" />
                                </div>
                                <p className="text-sm font-medium text-gray-500">Todo al día</p>
                                <p className="text-xs text-gray-400 mt-1">No tienes alertas pendientes</p>
                            </div>
                        )}
                    </div>

                    <div className="p-3 border-t border-gray-50 bg-gray-50/50 text-center">
                        <button className="text-[11px] font-bold text-gray-400 hover:text-blue-600 transition-colors uppercase tracking-wider">
                            Limpiar todo
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
