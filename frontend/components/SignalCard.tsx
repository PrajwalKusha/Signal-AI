"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ArrowRight, Zap, AlertTriangle, TrendingUp, AlertCircle } from "lucide-react";
import { clsx } from "clsx";

interface Metric {
    label: string;
    value: string;
    trend?: "up" | "down" | "neutral";
}

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
}

export function SignalCard({ signal }: { signal: Signal }) {
    const [expanded, setExpanded] = useState(false);
    const [showAction, setShowAction] = useState(false);

    // Map status to colors/icons
    const statusConfig = {
        CRITICAL: { color: "bg-red-500", icon: AlertCircle, label: "Revenue Leak" },
        "Revenue Leak": { color: "bg-red-500", icon: AlertCircle, label: "Revenue Leak" },
        OPPORTUNITY: { color: "bg-emerald-500", icon: TrendingUp, label: "Growth Opportunity" },
        Green: { color: "bg-emerald-500", icon: TrendingUp, label: "Growth Opportunity" },
        WATCH: { color: "bg-amber-500", icon: AlertTriangle, label: "Operational Bottleneck" },
        Yellow: { color: "bg-amber-500", icon: AlertTriangle, label: "Operational Bottleneck" },
    };

    const config = statusConfig[signal.status as keyof typeof statusConfig] || statusConfig["WATCH"];
    const Icon = config.icon;

    return (
        <motion.div
            layout
            className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-6"
        >
            {/* Header Card - Always Visible */}
            <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <span className={clsx("w-2 h-2 rounded-full", config.color)} />
                        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">{config.label}</span>
                    </div>
                    <div className="text-right">
                        <div className="text-xs text-slate-400 font-medium">EST. IMPACT</div>
                        <div className="text-lg font-bold text-slate-900">{signal.impact}</div>
                    </div>
                </div>

                <h3 className="text-xl font-semibold text-slate-900 mb-6">{signal.title}</h3>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setExpanded(!expanded)}
                        className="flex-1 bg-slate-50 hover:bg-slate-100 text-slate-700 py-2.5 px-4 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                    >
                        {expanded ? "Collapse Brief" : "Understand This"}
                        <ChevronDown className={clsx("w-4 h-4 transition-transform", expanded && "rotate-180")} />
                    </button>

                    {signal.recommendation && (
                        <button
                            onClick={() => setShowAction(!showAction)}
                            className="flex-1 bg-slate-900 hover:bg-slate-800 text-white py-2.5 px-4 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                        >
                            Act on This
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    )}
                </div>
            </div>

            {/* Expanded Analysis (Understand This) */}
            <AnimatePresence>
                {expanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="bg-slate-50 border-t border-slate-100"
                    >
                        <div className="p-6 prose prose-slate max-w-none">
                            <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">Analysis</h4>
                            <p className="text-slate-700 leading-relaxed whitespace-pre-line">{signal.prose}</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Action Panel (Act on This) */}
            <AnimatePresence>
                {showAction && signal.recommendation && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="bg-slate-900 text-white border-t border-slate-800"
                    >
                        <div className="p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <div className="flex items-center gap-2 text-emerald-400 mb-1">
                                        <Zap className="w-4 h-4" />
                                        <span className="text-xs font-bold uppercase tracking-wider">Recommended Action</span>
                                    </div>
                                    <h4 className="text-lg font-semibold">{signal.recommendation.project_title}</h4>
                                </div>
                                <div className="text-right">
                                    <div className="text-xs text-slate-400">ROI MULTIPLE</div>
                                    <div className="font-bold text-emerald-400">{signal.recommendation.roi_metric}</div>
                                </div>
                            </div>

                            <div className="bg-slate-800 p-4 rounded-lg mb-4 text-xs text-slate-300 font-mono">
                                <div className="mb-2 text-slate-500 uppercase">Market Context (Live Search)</div>
                                {signal.recommendation.market_context}
                            </div>

                            <p className="text-slate-300 text-sm leading-relaxed mb-6">
                                {signal.recommendation.technical_spec}
                            </p>

                            <div className="flex items-center justify-between border-t border-slate-800 pt-4">
                                <div className="text-xs text-slate-500">
                                    NET VALUE: <span className="text-emerald-400 ml-1 font-bold">${signal.recommendation.impact_usd?.toLocaleString()}</span>
                                </div>
                                <button className="bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold py-2 px-4 rounded transition-colors">
                                    APPROVE PROJECT
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
