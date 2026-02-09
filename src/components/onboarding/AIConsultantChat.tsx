"use client";

import { useState, useEffect, useRef } from "react";
import { Send, Bot, User, Sparkles, ChevronRight, BrainCircuit } from "lucide-react";

interface Message {
    id: string;
    role: "ai" | "user";
    content: string;
    timestamp: Date;
    options?: string[];
}

interface AIConsultantChatProps {
    onComplete: (data: any) => void;
}

export default function AIConsultantChat({ onComplete }: AIConsultantChatProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [step, setStep] = useState(0);
    const [collectedData, setCollectedData] = useState<any>({});

    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    // Script de la IA
    const script = [
        {
            id: "welcome",
            content: "¡Hola! Soy tu Consultor de Cunemo AI. 🤖✨ Mi objetivo es configurar tu CRM para que encaje como un guante con tu negocio. Para empezar, ¿cómo se llama tu empresa o proyecto?",
        },
        {
            id: "industry",
            content: "Excelente nombre. 💎 ¿A qué industria pertenece **{company}**? Esto me ayuda a sugerirte las mejores etapas de venta.",
            options: ["Servicios Profesionales", "SaaS / Tecnología", "Inmobiliaria", "E-commerce", "Otro"]
        },
        {
            id: "process",
            content: "Entendido. ¿Cómo es tu proceso de venta típico? Por ejemplo: ¿Buscas leads fríos o te llegan recomendaciones?",
        },
        {
            id: "critical",
            content: "Perfecto. Finalmente, ¿cuál es el dato más importante que necesitas ver cada mañana al despertar? (Ej: Ventas totales, Tareas pendientes, Leads nuevos)",
        },
        {
            id: "closing",
            content: "¡Muchas gracias! He analizado tu perfil y estoy preparando un panel personalizado para ti. ¿Listo para entrar a tu nuevo búnker de ventas?",
            options: ["¡Listo! Vamos allá 🚀"]
        }
    ];

    useEffect(() => {
        // Inicializar chat
        if (messages.length === 0) {
            addAIMessage(script[0].content);
        }
    }, []);

    const addAIMessage = (content: string, options?: string[]) => {
        setIsTyping(true);
        setTimeout(() => {
            const newMessage: Message = {
                id: Math.random().toString(36).substr(2, 9),
                role: "ai",
                content,
                timestamp: new Date(),
                options
            };
            setMessages(prev => [...prev, newMessage]);
            setIsTyping(false);
        }, 1500);
    };

    const handleSend = (text?: string) => {
        const messageText = text || inputValue;
        if (!messageText.trim()) return;

        const newUserMessage: Message = {
            id: Math.random().toString(36).substr(2, 9),
            role: "user",
            content: messageText,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, newUserMessage]);
        setInputValue("");

        // Lógica de progresión
        processResponse(messageText);
    };

    const processResponse = (text: string) => {
        const currentData = { ...collectedData };
        let nextStep = step + 1;

        if (step === 0) currentData.company = text;
        if (step === 1) currentData.industry = text;
        if (step === 2) currentData.process = text;
        if (step === 3) currentData.criticalMetric = text;

        setCollectedData(currentData);
        setStep(nextStep);

        if (nextStep < script.length) {
            const nextMsg = script[nextStep];
            const content = nextMsg.content.replace("{company}", currentData.company || "tu empresa");
            addAIMessage(content, nextMsg.options);
        } else {
            // Fin del chat
            setTimeout(() => onComplete(currentData), 2000);
        }
    };

    return (
        <div className="flex flex-col h-[500px] bg-white rounded-2xl overflow-hidden relative">
            {/* Chat Header */}
            <div className="bg-gradient-to-r from-[#004A8D] to-[#00AEEF] p-4 flex items-center gap-3 text-white shadow-lg z-10">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md">
                    <BrainCircuit size={20} />
                </div>
                <div>
                    <h3 className="font-bold text-sm tracking-tight">Cunemo AI Consultant</h3>
                    <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                        <span className="text-[10px] opacity-80 font-bold uppercase tracking-widest">En línea y analizando</span>
                    </div>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50/50 custom-scrollbar">
                {messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.role === "ai" ? "justify-start" : "justify-end"} animate-slideUp`}>
                        <div className={`flex gap-3 max-w-[85%] ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                            <div className={`
                                w-8 h-8 rounded-full flex items-center justify-center shrink-0
                                ${msg.role === "ai" ? "bg-white border border-blue-100 text-blue-500 shadow-sm" : "bg-blue-600 text-white shadow-md"}
                            `}>
                                {msg.role === "ai" ? <Bot size={16} /> : <User size={16} />}
                            </div>
                            <div className="space-y-2">
                                <div className={`
                                    p-4 rounded-2xl text-sm leading-relaxed shadow-sm
                                    ${msg.role === "ai" ? "bg-white text-gray-800 rounded-tl-none border border-gray-100" : "bg-blue-600 text-white rounded-tr-none"}
                                `}>
                                    {msg.content}
                                </div>

                                {msg.options && (
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {msg.options.map((opt) => (
                                            <button
                                                key={opt}
                                                onClick={() => handleSend(opt)}
                                                className="px-4 py-2 bg-white border border-blue-200 text-[#004A8D] text-xs font-bold rounded-full hover:bg-blue-50 hover:border-blue-300 transition-all shadow-sm active:scale-95"
                                            >
                                                {opt}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}

                {isTyping && (
                    <div className="flex justify-start animate-pulse">
                        <div className="flex gap-3">
                            <div className="w-8 h-8 rounded-full bg-white border border-blue-100 flex items-center justify-center text-blue-500 shadow-sm">
                                <Bot size={16} />
                            </div>
                            <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-gray-100 flex gap-1">
                                <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce"></div>
                                <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                                <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-gray-100">
                <div className="flex gap-2 bg-gray-50 p-2 rounded-xl focus-within:ring-2 focus-within:ring-blue-100 transition-all border border-transparent focus-within:border-blue-200">
                    <input
                        type="text"
                        placeholder="Escribe tu respuesta..."
                        className="flex-1 bg-transparent border-none outline-none text-sm px-2 text-gray-700"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && handleSend()}
                    />
                    <button
                        onClick={() => handleSend()}
                        disabled={!inputValue.trim()}
                        className="w-10 h-10 bg-gradient-to-br from-[#004A8D] to-[#00AEEF] text-white rounded-lg flex items-center justify-center hover:opacity-90 disabled:opacity-30 transition-all active:scale-90 shadow-md"
                    >
                        <Send size={18} />
                    </button>
                </div>
                <p className="text-[10px] text-gray-400 text-center mt-2 font-medium flex items-center justify-center gap-1">
                    <Sparkles size={10} className="text-blue-400" /> Powered by Cunemo Intelligence Engine
                </p>
            </div>
        </div>
    );
}
