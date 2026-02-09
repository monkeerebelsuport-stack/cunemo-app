"use client";
import { X } from "lucide-react";
import { useEffect, useState } from "react";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
    const [show, setShow] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setShow(true);
            document.body.style.overflow = "hidden"; // Prevent scroll
        } else {
            const timer = setTimeout(() => setShow(false), 200); // Animation duration
            document.body.style.overflow = "unset";
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    if (!show && !isOpen) return null;

    return (
        <div
            className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300
        ${isOpen ? "opacity-100 backdrop-blur-sm bg-black/30" : "opacity-0 backdrop-blur-none bg-transparent pointer-events-none"}
      `}
        >
            <div
                className={`bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-gray-100 transform transition-all duration-300
          ${isOpen ? "scale-100 translate-y-0" : "scale-95 translate-y-4"}
        `}
            >
                <div className="flex justify-between items-center p-6 border-b border-gray-50">
                    <h3 className="text-xl font-bold text-gray-800" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                        {title}
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-full transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 max-h-[80vh] overflow-y-auto custom-scrollbar">
                    {children}
                </div>
            </div>
        </div>
    );
}
