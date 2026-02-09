import { Deal } from "@/types/pipeline";
import { GripVertical } from "lucide-react";
import Link from "next/link";

interface DealCardProps {
    deal: Deal;
    isDragging?: boolean;
}

export default function DealCard({ deal, isDragging }: DealCardProps) {
    const diffMs = deal.lastActivityDate
        ? new Date().getTime() - new Date(deal.lastActivityDate).getTime()
        : null;

    const isStale = diffMs ? diffMs > 3 * 24 * 60 * 60 * 1000 : false;

    const getTimeAgo = (dateStr?: string) => {
        if (!dateStr) return null;
        const diff = new Date().getTime() - new Date(dateStr).getTime();
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        if (days === 0) return "Hoy";
        if (days === 1) return "Ayer";
        return `Hace ${days} d`;
    };

    const calculateRiskScore = () => {
        let score = 100;
        if (isStale) score -= 40;
        if (deal.probability < 40) score -= 30;
        if (deal.value > 10000 && isStale) score -= 10; // High value deals have higher risk focus
        return Math.max(0, score);
    }

    const riskScore = calculateRiskScore();
    const getRiskColor = (s: number) => {
        if (s > 75) return "bg-green-500";
        if (s > 40) return "bg-yellow-500";
        return "bg-red-500";
    }

    return (
        <Link href={`/dashboard/deals/${deal.id}`} className="block">
            <div
                className={`
        relative bg-white p-4 rounded-lg border shadow-sm 
        transition-all duration-200 cursor-grab group hover:shadow-md
        ${isDragging ? "shadow-xl rotate-2 scale-105 ring-2 ring-[#00AEEF] ring-opacity-50" : ""}
        ${riskScore <= 40 ? "border-red-100 bg-red-50/10" : isStale ? "border-orange-100 bg-orange-50/10" : "border-gray-100"}
      `}
            >
                {/* Risk Score Badge */}
                <div className={`absolute -top-2 -right-1 flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold text-white shadow-sm z-10 ${getRiskColor(riskScore)}`}>
                    {riskScore}% SC
                </div>

                <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-gray-800 text-sm leading-tight line-clamp-2">
                        {deal.title}
                    </h4>
                    <button className="text-gray-300 hover:text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity p-1">
                        <GripVertical size={14} />
                    </button>
                </div>

                <div className="flex items-center justify-between mb-3">
                    <p className="text-xs text-gray-500 flex items-center gap-1 truncate max-w-[120px]">
                        🏢 {deal.companyName}
                    </p>
                    {deal.lastActivityDate && (
                        <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${isStale ? "bg-orange-100 text-orange-600" : "bg-gray-100 text-gray-500"}`}>
                            ⚡ {getTimeAgo(deal.lastActivityDate)}
                        </span>
                    )}
                </div>

                <div className="flex items-center justify-between border-t border-gray-50 pt-3">
                    <span className="font-bold text-[#004A8D] text-sm">
                        {deal.currency} {deal.value.toLocaleString()}
                    </span>

                    {deal.probability > 0 && (
                        <div className="flex items-center gap-1" title="Probabilidad de cierre">
                            <div className="w-12 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                <div
                                    className={`h-full rounded-full ${deal.probability >= 80 ? "bg-[#8DC63F]" :
                                        deal.probability >= 50 ? "bg-orange-400" : "bg-red-400"
                                        }`}
                                    style={{ width: `${deal.probability}%` }}
                                />
                            </div>
                            <span className="text-[10px] text-gray-400 font-medium">{deal.probability}%</span>
                        </div>
                    )}
                </div>
            </div>
        </Link>
    );
}
