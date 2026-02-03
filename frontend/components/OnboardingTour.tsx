"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    ShieldCheck,
    Zap,
    Database,
    TrendingUp,
    Rocket,
    ChevronRight,
    ChevronLeft,
    X
} from "lucide-react";

const TOUR_STEPS = [
    {
        id: 1,
        title: "Welcome to Signals",
        subtitle: "The Strategic Radar for the AI-Native Enterprise",
        body: (
            <>
                <p className="mb-4">
                    You are logged in as <span className="font-bold text-slate-900">Nexus Flow</span> - a Global Growth-Stage B2B SaaS Enterprise characterized by high complexity and high-velocity expansion.
                </p>
                <p>
                    You are the CEO of NexusFlow. In a world of infinite data noise, you don't have time for traditional dashboards. You need a system that identifies <span className="font-bold text-red-600">revenue leaks</span> and <span className="font-bold text-emerald-600">growth opportunities</span> before they hit the quarterly report.
                </p>
            </>
        ),
        icon: ShieldCheck,
        color: "text-blue-600",
        bg: "bg-blue-50"
    },
    {
        id: 2,
        title: "Meet the Swarm",
        subtitle: "4 Specialized AI Agents, 1 Goal",
        body: (
            <>
                <p className="mb-4">Behind this interface, a <span className="font-mono text-xs bg-slate-100 px-1 py-0.5 rounded">LangGraph</span> workflow orchestrates a team of specialists:</p>
                <ul className="space-y-2 text-sm mb-4">
                    <li className="flex gap-2">
                        <span className="font-bold text-slate-900">The Analyst:</span>
                        <span className="text-slate-600">Scans 1,000+ sales records for statistical anomalies.</span>
                    </li>
                    <li className="flex gap-2">
                        <span className="font-bold text-slate-900">The Investigator:</span>
                        <span className="text-slate-600">Cross-references Slack, Emails, and Memos to find the "Why."</span>
                    </li>
                    <li className="flex gap-2">
                        <span className="font-bold text-slate-900">The Strategist:</span>
                        <span className="text-slate-600">Calculates ROI and matches problems to your project backlog.</span>
                    </li>
                    <li className="flex gap-2">
                        <span className="font-bold text-slate-900">The Ghostwriter:</span>
                        <span className="text-slate-600">Synthesizes everything into a high-density executive brief.</span>
                    </li>
                </ul>
                <a
                    href="/architecture"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm font-bold text-slate-900 hover:text-teal-600 transition-colors border-b border-slate-300 hover:border-teal-500 pb-0.5"
                >
                    View Detailed Architecture <ChevronRight size={14} />
                </a>
            </>
        ),
        icon: Zap,
        color: "text-amber-500",
        bg: "bg-amber-50"
    },
    {
        id: 3,
        title: "Signal, Not Noise",
        subtitle: "Intelligence Grounded in Truth",
        body: (
            <>
                <p className="mb-4">Nexus Command isn't just "guessing." It connects three distinct data silos to build a 360-degree view of your business:</p>
                <div className="grid grid-cols-1 gap-2 text-sm">
                    <div className="p-2 bg-slate-50 rounded border border-slate-100">
                        <span className="font-bold">📊 Sales CSV:</span> The hard, transactional truth.
                    </div>
                    <div className="p-2 bg-slate-50 rounded border border-slate-100">
                        <span className="font-bold">💬 Context Dump:</span> The human chatter—Slack, Jira, and Email logs.
                    </div>
                    <div className="p-2 bg-slate-50 rounded border border-slate-100">
                        <span className="font-bold">📂 Transformation Backlog:</span> Your company’s library of ready-to-deploy solutions.
                    </div>
                </div>
            </>
        ),
        icon: Database,
        color: "text-purple-600",
        bg: "bg-purple-50"
    },
    {
        id: 4,
        title: "The Signal-to-Action Loop",
        subtitle: "From Insight to Execution",
        body: (
            <>
                <p className="mb-4">
                    Every "Signal" you see identifies a <span className="font-bold text-slate-900">Transformation Champion</span>—the actual employee who proposed the fix.
                </p>
                <p>
                    Review the <span className="font-bold text-emerald-600">Impact USD</span>, evaluate the Feasibility Score, and click "Approve Build" to instantly move from a detected leak to a deployed solution.
                </p>
            </>
        ),
        icon: TrendingUp,
        color: "text-emerald-600",
        bg: "bg-emerald-50"
    },
    {
        id: 5,
        title: "Ready to Lead?",
        subtitle: "Your morning brief is ready.",
        body: (
            <>
                <p className="mb-6 text-lg text-slate-700">
                    We’ve pre-loaded a sample audit of NexusFlow to show you the power of the swarm. Explore the critical revenue leaks in APAC and the massive growth opportunity in EMEA.
                </p>
            </>
        ),
        icon: Rocket,
        color: "text-indigo-600",
        bg: "bg-indigo-50",
        isLast: true
    }
];

export function OnboardingTour({ onClose }: { onClose: () => void }) {
    const [step, setStep] = useState(0);

    const handleNext = () => {
        if (step < TOUR_STEPS.length - 1) {
            setStep(step + 1);
        } else {
            onClose();
        }
    };

    const handleBack = () => {
        if (step > 0) {
            setStep(step - 1);
        }
    };

    const currentStep = TOUR_STEPS[step];
    const Icon = currentStep.icon;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md h-screen w-screen">
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden relative border border-slate-100 flex flex-col max-h-[85vh]"
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors z-10 bg-white/50 rounded-full p-1"
                >
                    <X size={20} />
                </button>

                {/* Header Image / Icon Area - Fixed at top */}
                <div className={`h-32 ${currentStep.bg} flex-shrink-0 flex items-center justify-center relative overflow-hidden`}>
                    <div className="absolute inset-0 opacity-10 pattern-grid-lg" />
                    <motion.div
                        key={`icon-${step}`}
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring", duration: 0.5 }}
                        className={`p-6 rounded-full bg-white shadow-xl ${currentStep.color}`}
                    >
                        <Icon size={48} />
                    </motion.div>
                </div>

                {/* Content Area - Scrollable */}
                <div className="p-8 md:p-10 flex-1 overflow-y-auto">
                    <div className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                        Step {step + 1} of {TOUR_STEPS.length}
                    </div>

                    <motion.h2
                        key={`title-${step}`}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-2xl md:text-3xl font-bold text-slate-900 mb-2"
                    >
                        {currentStep.title}
                    </motion.h2>

                    <motion.h3
                        key={`subtitle-${step}`}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-lg text-slate-500 font-medium mb-6"
                    >
                        {currentStep.subtitle}
                    </motion.h3>

                    <motion.div
                        key={`body-${step}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-slate-600 leading-relaxed space-y-4"
                    >
                        {currentStep.body}
                    </motion.div>
                </div>

                {/* Footer / Navigation - Fixed at bottom */}
                <div className="p-6 bg-slate-50 border-t border-slate-100 flex-shrink-0 flex items-center justify-between">
                    {/* Dots */}
                    <div className="flex items-center gap-2">
                        {TOUR_STEPS.map((_, i) => (
                            <div
                                key={i}
                                className={`w-2 h-2 rounded-full transition-all ${i === step ? "bg-slate-900 w-6" : "bg-slate-300"
                                    }`}
                            />
                        ))}
                    </div>

                    <div className="flex items-center gap-3">
                        {step > 0 && (
                            <button
                                onClick={handleBack}
                                className="text-slate-500 font-medium px-4 py-2 hover:text-slate-800 transition-colors"
                            >
                                Back
                            </button>
                        )}

                        <button
                            onClick={handleNext}
                            className={`flex items-center gap-2 px-6 py-2.5 rounded-full font-bold text-white transition-all shadow-lg hover:scale-105 active:scale-95 ${currentStep.isLast
                                ? "bg-slate-900 hover:bg-slate-800"
                                : "bg-teal-600 hover:bg-teal-700"
                                }`}
                        >
                            {currentStep.isLast ? (
                                <>
                                    Engage Command <Rocket size={18} />
                                </>
                            ) : (
                                <>
                                    Next <ChevronRight size={18} />
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
