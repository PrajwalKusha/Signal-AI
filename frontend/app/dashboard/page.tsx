"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { SignalCard } from "@/components/SignalCard";
import {
    Terminal,
    CheckCircle2,
    Loader2,
    Sparkles,
    Zap,
    Bell,
    Clock
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Dashboard() {
    const [gatheringSignals, setGatheringSignals] = useState(false);
    const [allSignals, setAllSignals] = useState<any[]>([]);
    const [visibleSignals, setVisibleSignals] = useState<any[]>([]);
    const [logs, setLogs] = useState<string[]>([]);
    const [showPrompt, setShowPrompt] = useState(false);
    const [hasScanned, setHasScanned] = useState(false);
    const [showNoMoreSignals, setShowNoMoreSignals] = useState(false);
    const promptTimerRef = useRef<NodeJS.Timeout | null>(null);

    // Detailed agent logs for theatrical effect
    const AGENT_LOGS = [
        "--- Analyst Agent: Code Interpreter Mode ---",
        "⏳ Generating Python code with GPT-4o...",
        "✅ Code Generated (2585 chars). Cleaning...",
        "🚀 Executing Python code in REPL...",
        "✅ Success: Found 50 anomalies from LLM.",
        "",
        "🔍 Validating evidence coverage...",
        "📊 Evidence Extraction Stats:",
        "  Total Anomalies Detected: 50",
        "  LLM Generated Evidence: 50 (100.0%)",
        "  Fallback Used: 0 (0.0%)",
        "  Evidence Coverage: 100% ✓",
        "",
        "🎯 Filtering to top 10 most significant anomalies by impact...",
        "  Returning top 10 anomalies (out of 50 detected)",
        "  Impact range: $1,447,567 - $3,005,539",
        "",
        "--- Investigator Agent: Searching Internal Context ---",
        "Found 10 insights.",
        "",
        "--- Strategist Agent: Calculating Financial Impact ---",
        "[Strategist] Match found: 'AI Competitive Switch-Kit' (TRANS-001).",
        "[Strategist] ROI Projected: 3.1x | Impact: $2.45M.",
        "",
        "--- Ghostwriter Agent: Synthesizing Executive Signals ---",
        "Generated 10 executive brief(s).",
        "",
        "[Storage] Saving signals to persistent storage...",
        "[Storage] ✓ Saved 5 new, updated 5 existing. Total: 10 signals.",
        "--- Analysis Complete ---"
    ];

    // Load all signals from backend on mount
    useEffect(() => {
        const loadAllSignals = async () => {
            try {
                const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
                const response = await fetch(`${API_URL}/api/signals`);
                const data = await response.json();

                if (data.status === 'success' && data.signals.length > 0) {
                    setAllSignals(data.signals);
                    sessionStorage.setItem('allSignals', JSON.stringify(data.signals));

                    // Check if user has already scanned in this session
                    const sessionHasScanned = sessionStorage.getItem('hasScanned') === 'true';
                    const sessionVisibleCount = parseInt(sessionStorage.getItem('visibleSignalsCount') || '5');

                    if (sessionHasScanned) {
                        // Restore previous session state
                        setHasScanned(true);
                        setVisibleSignals(data.signals.slice(0, sessionVisibleCount));
                    } else {
                        // First time - show 5 signals
                        setVisibleSignals(data.signals.slice(0, 5));
                        sessionStorage.setItem('visibleSignalsCount', '5');

                        // Start timer to show prompt after 60 seconds
                        promptTimerRef.current = setTimeout(() => {
                            const stillNotScanned = sessionStorage.getItem('hasScanned') !== 'true';
                            if (stillNotScanned) {
                                setShowPrompt(true);
                            }
                        }, 60000); // 60 seconds
                    }
                }
            } catch (error) {
                console.error("Failed to load signals", error);
            }
        };

        loadAllSignals();

        // Cleanup timer on unmount
        return () => {
            if (promptTimerRef.current) {
                clearTimeout(promptTimerRef.current);
            }
        };
    }, []);

    // Simulate agent scan with theatrical logs
    const runTheatricalScan = async () => {
        // If already showing all signals, show "no more signals" message
        if (visibleSignals.length === allSignals.length) {
            setShowNoMoreSignals(true);
            setTimeout(() => setShowNoMoreSignals(false), 3000);
            return;
        }

        setGatheringSignals(true);
        setLogs([]);
        setShowPrompt(false);

        // Stream logs with realistic timing
        let logIndex = 0;
        const logInterval = setInterval(() => {
            if (logIndex < AGENT_LOGS.length) {
                setLogs(prev => [...prev, AGENT_LOGS[logIndex]]);
                logIndex++;
            } else {
                clearInterval(logInterval);

                // After logs complete, reveal remaining signals
                setTimeout(() => {
                    setVisibleSignals(allSignals);
                    setHasScanned(true);
                    setGatheringSignals(false);

                    // Persist to sessionStorage
                    sessionStorage.setItem('hasScanned', 'true');
                    sessionStorage.setItem('visibleSignalsCount', allSignals.length.toString());
                }, 500);
            }
        }, 300); // 300ms between each log line
    };

    return (
        <div className="space-y-8 min-h-screen pb-20">
            {/* 1. Hero / Header Area */}
            <div className="flex flex-col md:flex-row items-end justify-between gap-6 pt-4">
                <div>
                    <div className="flex items-center gap-2 text-xs font-bold text-teal-600 mb-2 uppercase tracking-wider">
                        <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse"></span>
                        Nexus Intelligence
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
                        Live Signals
                    </h1>
                    <p className="text-slate-500 mt-2 max-w-lg">
                        Real-time strategic anomalies detected by your agent swarm.
                    </p>
                </div>

                {/* Primary Action - Scan Button */}
                <div className="relative">
                    <button
                        onClick={runTheatricalScan}
                        disabled={gatheringSignals}
                        className={`group relative flex items-center gap-3 px-8 py-4 rounded-full font-bold shadow-xl transition-all hover:scale-105 ${gatheringSignals
                                ? 'bg-slate-100 text-slate-400 cursor-wait'
                                : showPrompt
                                    ? 'bg-teal-600 text-white hover:bg-teal-700 animate-pulse'
                                    : 'bg-slate-900 text-white hover:bg-slate-800'
                            }`}
                    >
                        {gatheringSignals ? (
                            <>
                                <Loader2 className="animate-spin" size={20} />
                                Scanning...
                            </>
                        ) : (
                            <>
                                <Zap className={showPrompt ? "fill-current animate-bounce" : "fill-current"} size={20} />
                                <span>Scan for Intelligence</span>
                            </>
                        )}

                        {/* Notification badge */}
                        {showPrompt && !gatheringSignals && (
                            <span className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs flex items-center justify-center animate-bounce">
                                <Bell size={14} />
                            </span>
                        )}
                    </button>

                    {/* Tooltip prompt */}
                    <AnimatePresence>
                        {showPrompt && !gatheringSignals && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="absolute top-full mt-3 right-0 bg-slate-900 text-white px-4 py-3 rounded-lg shadow-2xl text-sm font-medium whitespace-nowrap z-10"
                            >
                                <div className="flex items-center gap-2">
                                    <Sparkles size={16} className="text-teal-400" />
                                    New signals detected! Click to refresh
                                </div>
                                {/* Arrow */}
                                <div className="absolute -top-2 right-6 w-4 h-4 bg-slate-900 transform rotate-45"></div>
                            </motion.div>
                        )}

                        {/* "No more signals" message */}
                        {showNoMoreSignals && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="absolute top-full mt-3 right-0 bg-slate-900 text-white px-4 py-3 rounded-lg shadow-2xl text-sm font-medium whitespace-nowrap z-10"
                            >
                                <div className="flex items-center gap-2">
                                    <Clock size={16} className="text-amber-400" />
                                    No more signals for now. Check back later!
                                </div>
                                {/* Arrow */}
                                <div className="absolute -top-2 right-6 w-4 h-4 bg-slate-900 transform rotate-45"></div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* 2. Active Log Terminal (Visible during scan) */}
            <AnimatePresence>
                {gatheringSignals && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-slate-950 rounded-xl overflow-hidden border border-slate-800 shadow-2xl"
                    >
                        <div className="bg-slate-900 px-4 py-2 flex items-center justify-between border-b border-slate-800">
                            <span className="text-xs font-mono text-teal-400 flex items-center gap-2">
                                <Terminal size={14} /> AGENT_SWARM_V2
                            </span>
                            <Loader2 size={14} className="text-slate-500 animate-spin" />
                        </div>
                        <div className="p-4 font-mono text-xs text-slate-300 space-y-1 max-h-96 overflow-y-auto">
                            {logs.map((log, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className={log === "" ? "h-2" : ""}
                                >
                                    {log && (
                                        <>
                                            <span className="text-slate-600 mr-2">{new Date().toLocaleTimeString()}</span>
                                            {log}
                                        </>
                                    )}
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* 3. Signal Grid */}
            <div className="grid grid-cols-1 gap-6">
                <AnimatePresence mode="popLayout">
                    {visibleSignals.map((signal, index) => (
                        <motion.div
                            key={signal.signal_id}
                            layout
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Link href={`/dashboard/signals/${signal.signal_id}`}>
                                <SignalCard signal={signal} />
                            </Link>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* 4. Empty State Fallback */}
            {visibleSignals.length === 0 && !gatheringSignals && (
                <div className="text-center py-20 text-slate-400">
                    <Sparkles className="w-12 h-12 mx-auto mb-4 text-slate-200" />
                    <p>System Idle. Initialize scan to begin.</p>
                </div>
            )}
        </div>
    );
}
