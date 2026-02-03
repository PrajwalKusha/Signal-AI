"use client";

import { motion } from "framer-motion";
import { ArrowRight, AlertTriangle, TrendingUp, AlertCircle, Clock, ChevronRight } from "lucide-react";

interface Recommendation {
    project_title: string;
    impact_usd: number;
    market_context: string;
    roi_metric: string;
    feasibility_score: number;
    technical_spec: string;
}

interface Signal {
    signal_id: string;
    title: string;
    prose: string;
    status: "CRITICAL" | "OPPORTUNITY" | "WATCH" | "Green" | "Yellow" | string;
    impact: string;
    recommendation?: Recommendation | null;
    summary?: string;
    date?: string;
}

export function SignalCard({ signal, isNew }: { signal: Signal; isNew?: boolean }) {
    // Map status to colors/icons for Light Theme
    const statusConfig = {
        CRITICAL: {
            bg: "bg-white",
            text: "text-red-700",
            border: "border-red-500",
            iconColor: "text-red-600",
            icon: AlertCircle,
            label: "Revenue Leak",
        },
        critical: { // Handle lowercase from JSON
            bg: "bg-white",
            text: "text-red-700",
            border: "border-red-500",
            iconColor: "text-red-600",
            icon: AlertCircle,
            label: "Revenue Leak",
        },
        OPPORTUNITY: {
            bg: "bg-white",
            text: "text-teal-700",
            border: "border-teal-500",
            iconColor: "text-teal-600",
            icon: TrendingUp,
            label: "Growth Opportunity",
        },
        medium: { // Handle 'medium' as Growth Opportunity
            bg: "bg-white",
            text: "text-emerald-700",
            border: "border-emerald-500",
            iconColor: "text-emerald-600",
            icon: TrendingUp,
            label: "Growth Opportunity",
        },
        WATCH: {
            bg: "bg-white",
            text: "text-amber-700",
            border: "border-amber-500",
            iconColor: "text-amber-600",
            icon: AlertTriangle,
            label: "Bottleneck",
        },
    };

    const config = statusConfig[signal.status as keyof typeof statusConfig] || statusConfig["WATCH"];
    const Icon = config.icon;

    return (
        <div
            className={`
                group relative flex flex-col justify-between p-5 rounded-xl border border-gray-200 bg-white hover:border-teal-500/50 transition-all duration-200 h-full
            `}
        >
            {/* Top: Header & Status */}
            <div>
                <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg bg-slate-50 ${config.iconColor}`}>
                            <Icon size={18} />
                        </div>
                        {isNew && (
                            <span className="px-1.5 py-px rounded text-[8px] font-extrabold bg-blue-600 text-white uppercase tracking-wider animate-pulse">
                                NEW
                            </span>
                        )}
                    </div>

                    {/* Status Tags */}
                    <div className="flex items-center gap-2">
                        {/* Dynamic Sub-tag for Growth Opps */}
                        {(signal.status === 'medium' || signal.status === 'OPPORTUNITY' || signal.status === 'Green') && (
                            <span className="px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-500 border border-slate-200">
                                {signal.title.includes("APAC") ? "APAC Expansion" :
                                    signal.title.includes("EMEA") ? "EMEA Market" :
                                        signal.title.includes("LATAM") ? "LATAM Region" :
                                            signal.title.includes("Professional") ? "GTM Strategy" : "Market Intel"}
                            </span>
                        )}
                        <div className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-50 ${config.text}`}>
                            {config.label}
                        </div>
                    </div>
                </div>

                <h3 className="font-bold text-slate-800 text-base leading-tight mb-2 group-hover:text-teal-600 transition-colors line-clamp-2">
                    {signal.title}
                </h3>

                <p className="text-xs text-slate-500 line-clamp-3 mb-4 leading-relaxed">
                    {signal.summary || signal.prose}
                </p>
            </div>

            {/* Bottom: Metrics & Footer */}
            <div className="space-y-3 mt-auto">
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div className="flex flex-col">
                        <span className="text-[10px] uppercase text-slate-400 font-bold">Impact</span>
                        <span className="text-sm font-mono font-bold text-slate-700">{signal.impact}</span>
                    </div>
                    <div className="flex flex-col items-end">
                        <span className="text-[10px] uppercase text-slate-400 font-bold">Detected</span>
                        <div className="text-xs font-medium text-slate-600 flex items-center gap-1">
                            <Clock size={10} />
                            {signal.date ? new Date(signal.date).toLocaleDateString() : 'N/A'}
                        </div>
                    </div>
                </div>

                {/* Action Hover */}
                <div className="overflow-hidden h-0 group-hover:h-auto group-hover:mt-2 transition-all opacity-0 group-hover:opacity-100">
                    <div className="w-full py-1.5 text-center bg-slate-50 text-slate-600 text-xs font-bold rounded hover:bg-teal-50 hover:text-teal-700 transition-colors">
                        View Analysis &rarr;
                    </div>
                </div>
            </div>
        </div>
    );
}
