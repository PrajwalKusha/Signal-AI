"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    X,
    TrendingUp,
    ArrowRight,
    Search,
    ShieldAlert,
    CheckCircle2,
    FileText,
    ExternalLink,
    Zap,
    Target,
    BarChart3,
    User,
    Calendar,
    MessageSquare
} from "lucide-react";

interface SignalBriefingModalProps {
    signal: any;
    isOpen: boolean;
    onClose: () => void;
}

export function SignalBriefingModal({ signal, isOpen, onClose }: SignalBriefingModalProps) {
    if (!isOpen || !signal) return null;

    // Use Agent 3/4 enhanced data if available, otherwise fallback
    const recommendedAction = signal.recommendation || {
        project_title: "Investigation Pending",
        roi_metric: "N/A",
        impact_usd: "0",
        market_context: "Strategy agent is analyzing market trends...",
        feasibility_score: 5
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
                    />

                    {/* Slide-over Panel */}
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed top-0 right-0 h-full w-full md:w-[600px] bg-white shadow-2xl z-[70] overflow-y-auto border-l border-gray-100"
                    >
                        {/* Header */}
                        <div className="sticky top-0 bg-white/90 backdrop-blur-md z-10 border-b border-gray-100 px-6 py-5 flex items-start justify-between">
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${signal.severity === "critical" ? "bg-red-50 text-red-600 border-red-100" :
                                        signal.severity === "high" ? "bg-orange-50 text-orange-600 border-orange-100" :
                                            "bg-blue-50 text-blue-600 border-blue-100"
                                        }`}>
                                        {signal.severity} Priority
                                    </span>
                                    <span className="text-gray-400 text-xs font-mono">{signal.signal_id || "SIG-001"}</span>
                                </div>
                                <h2 className="text-xl font-bold text-gray-900 leading-tight">
                                    {signal.title}
                                </h2>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-gray-100 rounded-full text-gray-400 transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Content Scroll */}
                        <div className="p-6 space-y-8">

                            {/* 1. Executive Summary (Ghostwriter) */}
                            <section>
                                <div className="flex items-center gap-2 mb-3">
                                    <FileText size={18} className="text-[#00897B]" />
                                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Executive Briefing</h3>
                                </div>
                                <div className="bg-gray-50 p-5 rounded-xl border border-gray-100 text-sm leading-relaxed text-gray-700 whitespace-pre-wrap">
                                    {signal.prose}
                                </div>
                            </section>

                            {/* 2. Solution Architect (Employee Attribution) */}
                            {signal.employee_attribution && (
                                <section>
                                    <div className="flex items-center gap-2 mb-3">
                                        <User size={18} className="text-purple-600" />
                                        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Solution Architect</h3>
                                    </div>
                                    <div className="bg-gradient-to-br from-purple-50 to-indigo-50 p-5 rounded-xl border border-purple-100 shadow-sm">
                                        <div className="flex items-start gap-4 mb-4">
                                            {/* Avatar with Initials */}
                                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 text-white flex items-center justify-center font-bold text-lg shadow-md flex-shrink-0">
                                                {signal.employee_attribution.name
                                                    .split(' ')
                                                    .map((n: string) => n[0])
                                                    .join('')
                                                    .toUpperCase()}
                                            </div>
                                            <div className="flex-1">
                                                <div className="font-bold text-gray-900 text-base">
                                                    {signal.employee_attribution.name}
                                                </div>
                                                <div className="text-xs text-purple-700 font-medium">
                                                    {signal.employee_attribution.department}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Proposal Quote */}
                                        {signal.employee_attribution.proposal_quote && (
                                            <div className="bg-white/60 p-4 rounded-lg border border-purple-100 mb-3">
                                                <div className="text-xs font-bold text-purple-600 uppercase mb-1.5">Original Proposal</div>
                                                <p className="text-sm text-gray-700 italic leading-relaxed">
                                                    "{signal.employee_attribution.proposal_quote}"
                                                </p>
                                            </div>
                                        )}

                                        {/* Submission Details */}
                                        <div className="flex items-center gap-4 text-xs text-gray-600">
                                            <div className="flex items-center gap-1.5">
                                                <Calendar size={12} className="text-purple-500" />
                                                <span>{signal.employee_attribution.submission_date}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <MessageSquare size={12} className="text-purple-500" />
                                                <span>{signal.employee_attribution.submission_channel}</span>
                                            </div>
                                        </div>
                                    </div>
                                </section>
                            )}

                            {/* 3. Strategic Response (Strategist) */}
                            <section>
                                <div className="flex items-center gap-2 mb-4">
                                    <Target size={18} className="text-indigo-600" />
                                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Strategic Response</h3>
                                </div>

                                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                                    {/* Action Header */}
                                    <div className="bg-indigo-50/50 p-4 border-b border-indigo-50 flex items-start gap-4">
                                        <div className="p-2 bg-white rounded-lg border border-indigo-100 shadow-sm text-indigo-600">
                                            <Zap size={20} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900 text-sm">Recommended Action</h4>
                                            <p className="text-indigo-700 font-bold text-lg leading-tight mt-1">
                                                {recommendedAction.project_title}
                                            </p>
                                        </div>
                                    </div>

                                    {/* ROI Engine */}
                                    <div className="p-5 grid grid-cols-2 gap-4 bg-gradient-to-br from-white to-gray-50">
                                        <div>
                                            <div className="text-[10px] uppercase font-bold text-gray-400 mb-1">Proj. Impact</div>
                                            <div className="text-2xl font-bold text-emerald-600 flex items-baseline gap-1">
                                                ${recommendedAction.impact_usd ? (recommendedAction.impact_usd / 1000).toLocaleString() + 'k' : '0'}
                                                <span className="text-xs font-normal text-emerald-700/60">Annual</span>
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-[10px] uppercase font-bold text-gray-400 mb-1">ROI Multiple</div>
                                            <div className="text-2xl font-bold text-indigo-600">
                                                {recommendedAction.roi_metric}
                                            </div>
                                        </div>

                                        <div className="col-span-2 pt-2 border-t border-gray-100 mt-2">
                                            <div className="flex items-center justify-between text-xs mb-1.5">
                                                <span className="font-bold text-gray-500">Feasibility Score</span>
                                                <span className="font-bold text-gray-700">{recommendedAction.feasibility_score}/10</span>
                                            </div>
                                            <div className="w-full bg-gray-100 rounded-full h-1.5">
                                                <div
                                                    className="bg-indigo-500 h-1.5 rounded-full"
                                                    style={{ width: `${(recommendedAction.feasibility_score / 10) * 100}%` }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* 3. Market Context (Investigator + Tavily) */}
                            <section>
                                <div className="flex items-center gap-2 mb-3">
                                    <Search size={18} className="text-blue-500" />
                                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Market Intelligence</h3>
                                </div>
                                <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                                    <div className="flex gap-3">
                                        <div className="mt-1">
                                            <ExternalLink size={14} className="text-blue-400" />
                                        </div>
                                        <div>
                                            <h5 className="text-xs font-bold text-blue-700 uppercase mb-1">External Evidence</h5>
                                            <p className="text-xs text-blue-900/70 leading-relaxed italic">
                                                "{recommendedAction.market_context}"
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* 4. Internal Logs (Investigator) */}
                            {signal.context_source && (
                                <section>
                                    <div className="flex items-center gap-2 mb-3">
                                        <BarChart3 size={18} className="text-gray-400" />
                                        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Internal Context</h3>
                                    </div>
                                    <div className="pl-4 border-l-2 border-gray-200 py-1">
                                        <p className="text-xs text-gray-500">
                                            <span className="font-bold text-gray-700">Source:</span> {signal.context_source}
                                        </p>
                                        <p className="text-xs text-gray-500 mt-1">
                                            Matches anomaly pattern #A992-B. Confirmed by Sales Engineering logs.
                                        </p>
                                    </div>
                                </section>
                            )}

                            {/* Footer Actions */}
                            <div className="pt-6 border-t border-gray-100 flex gap-3">
                                <button className="flex-1 bg-[#00897B] hover:bg-[#00796B] text-white py-3 rounded-xl font-bold text-sm shadow-lg shadow-teal-900/10 transition-transform active:scale-[0.98]">
                                    Approve Strategy
                                </button>
                                <button className="px-6 border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold text-sm rounded-xl transition-colors">
                                    Reject
                                </button>
                            </div>

                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
