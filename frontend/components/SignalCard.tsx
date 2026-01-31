"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, AlertTriangle, TrendingUp, AlertCircle, Clock } from "lucide-react";

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

export function SignalCard({ signal }: { signal: Signal }) {
    const [expanded, setExpanded] = useState(false);

    // Map status to colors/icons for Light Theme
    const statusConfig = {
        CRITICAL: {
            bg: "bg-red-50", text: "text-red-700", border: "border-red-100", icon: AlertCircle, label: "Revenue Leak"
        },
        "Revenue Leak": {
            bg: "bg-red-50", text: "text-red-700", border: "border-red-100", icon: AlertCircle, label: "Revenue Leak"
        },
        OPPORTUNITY: {
            bg: "bg-[#E0F2F1]", text: "text-[#00796B]", border: "border-[#B2DFDB]", icon: TrendingUp, label: "Growth Opportunity"
        },
        Green: {
            bg: "bg-[#E0F2F1]", text: "text-[#00796B]", border: "border-[#B2DFDB]", icon: TrendingUp, label: "Growth Opportunity"
        },
        WATCH: {
            bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-100", icon: AlertTriangle, label: "Operational Bottleneck"
        },
        Yellow: {
            bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-100", icon: AlertTriangle, label: "Operational Bottleneck"
        },
        high: {
            bg: "bg-red-50", text: "text-red-700", border: "border-red-100", icon: AlertCircle, label: "High Priority"
        },
        medium: {
            bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-100", icon: AlertTriangle, label: "Medium Priority"
        },
        resolved: {
            bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-100", icon: TrendingUp, label: "Resolved"
        }
    };

    const config = statusConfig[signal.status as keyof typeof statusConfig] || statusConfig["WATCH"];
    const Icon = config.icon;

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group"
        >
            <div className="p-5">
                {/* Header Row */}
                <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex-1">
                        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${config.bg} ${config.text} ${config.border} mb-3`}>
                            {config.label}
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 leading-tight mb-2 group-hover:text-[#00897B] transition-colors">
                            {signal.title}
                        </h3>
                        {signal.summary && (
                            <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">
                                {signal.summary}
                            </p>
                        )}
                    </div>

                    {/* Impact Box - Removed Border as requested */}
                    <div className="text-right flex-shrink-0 bg-gray-50 px-3 py-2 rounded-lg">
                        <div className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-0.5">Impact</div>
                        <div className="text-sm font-bold text-gray-900 whitespace-nowrap">{signal.impact}</div>
                    </div>
                </div>

                {/* Footer Row */}
                <div className="flex items-center justify-between pt-4 mt-2 border-t border-gray-100">
                    <div className="flex items-center gap-4 text-xs text-gray-400">
                        {signal.date && (
                            <div className="flex items-center gap-1.5">
                                <Clock size={14} />
                                <span>{signal.date}</span>
                            </div>
                        )}
                        <div className="flex items-center gap-1.5">
                            <div className="flex -space-x-1.5">
                                <div className="w-5 h-5 rounded-full bg-teal-100 border-2 border-white"></div>
                                <div className="w-5 h-5 rounded-full bg-blue-100 border-2 border-white"></div>
                            </div>
                            <span>2 assigned</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setExpanded(!expanded)}
                            className="text-xs font-medium text-gray-500 hover:text-gray-900 px-3 py-1.5 rounded-md hover:bg-gray-100 transition-colors"
                        >
                            {expanded ? "Hide details" : "Show details"}
                        </button>

                        <button className="flex items-center gap-1.5 bg-[#00897B] hover:bg-[#00796B] text-white text-xs font-medium px-3 py-1.5 rounded-md transition-colors shadow-sm">
                            View Signal
                            <ArrowRight size={14} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Expanded Content */}
            <AnimatePresence>
                {expanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="bg-gray-50 border-t border-gray-100"
                    >
                        <div className="p-5">
                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                                Signal Analysis
                            </h4>
                            <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                                {signal.prose}
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
