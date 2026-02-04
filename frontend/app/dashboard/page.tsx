"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { SignalCard } from "@/components/SignalCard";
import { SystemHealthCode } from "@/components/SystemHealthCode";
import { ImpactTicker } from "@/components/ImpactTicker";
import { RainbowButton } from "@/components/magicui/rainbow-button";
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
    const [showNewTags, setShowNewTags] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const promptTimerRef = useRef<NodeJS.Timeout | null>(null);

    // Check for new tag visibility on mount/update
    useEffect(() => {
        if (hasScanned) {
            const storedTs = sessionStorage.getItem('scanTimestamp');
            if (storedTs) {
                const timePassed = Date.now() - parseInt(storedTs);
                if (timePassed < 120000) { // 2 minutes
                    setShowNewTags(true);
                    const timer = setTimeout(() => setShowNewTags(false), 120000 - timePassed);
                    return () => clearTimeout(timer);
                } else {
                    setShowNewTags(false);
                }
            }
        }
    }, [hasScanned]);

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
                        setVisibleSignals(data.signals);
                    } else {
                        // First time - show OLDER signals (simulating that we haven't found new ones yet)
                        // Assuming signals come in Newest -> Oldest, we skip the first 5
                        setVisibleSignals(data.signals.slice(5));
                        sessionStorage.setItem('visibleSignalsCount', '5');

                        // Start timer to show prompt after 60 seconds
                        promptTimerRef.current = setTimeout(() => {
                            const stillNotScanned = sessionStorage.getItem('hasScanned') !== 'true';
                            if (stillNotScanned) {
                                setShowPrompt(true);
                            }
                        }, 15000); // 15 seconds
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

                // After logs complete, reveal ALL signals (New ones will be at top)
                setTimeout(() => {
                    setVisibleSignals(allSignals);
                    setHasScanned(true);
                    setGatheringSignals(false);
                    setShowNewTags(true);

                    // Persist to sessionStorage
                    const now = Date.now();
                    sessionStorage.setItem('scanTimestamp', now.toString());
                    sessionStorage.setItem('hasScanned', 'true');
                    sessionStorage.setItem('visibleSignalsCount', allSignals.length.toString());

                    // Auto-hide tags after 2 mins
                    setTimeout(() => setShowNewTags(false), 120000);
                }, 500);
            }
        }, 300); // 300ms between each log line
    };

    return (
        <div className="space-y-8 min-h-screen pb-20 relative">
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
                    <div
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                    >
                        <RainbowButton
                            onClick={runTheatricalScan}
                            disabled={gatheringSignals}
                            className={gatheringSignals ? "opacity-80 cursor-wait" : ""}
                        >
                            {gatheringSignals ? (
                                <>
                                    <Loader2 className="animate-spin mr-2" size={16} />
                                    Scanning...
                                </>
                            ) : showNoMoreSignals ? (
                                <>
                                    <Clock className="mr-2" size={16} />
                                    No more signals
                                </>
                            ) : isHovered ? (
                                <>
                                    <Sparkles className="mr-2" size={16} />
                                    New signals found
                                </>
                            ) : (
                                <>
                                    <Zap className="mr-2 fill-current" size={16} />
                                    Scan for Intelligence
                                </>
                            )}
                        </RainbowButton>
                    </div>
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

            {/* MAIN GRID LAYOUT */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* LEFT COLUMN: SIGNALS */}
                <div className="lg:col-span-2">
                    <AnimatePresence mode="popLayout">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {visibleSignals.map((signal, index) => (
                                <motion.div
                                    key={signal.signal_id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: index * 0.05 }}
                                >
                                    <Link href={`/dashboard/signals/${signal.signal_id}`} className="block h-full">
                                        <SignalCard signal={signal} isNew={index < 5 && showNewTags} />
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    </AnimatePresence>

                    {/* Empty State Fallback */}
                    {visibleSignals.length === 0 && !gatheringSignals && (
                        <div className="text-center py-20 text-slate-400">
                            <Sparkles className="w-12 h-12 mx-auto mb-4 text-slate-200" />
                            <p>System Idle. Initialize scan to begin.</p>
                        </div>
                    )}
                </div>

                {/* RIGHT COLUMN: STATS & VISUALS */}
                <div className="bg-slate-50 rounded-2xl p-6 space-y-6 border border-slate-100 h-fit">
                    <SystemHealthCode />
                    <ImpactTicker />
                    <AgentNetwork />
                </div>

            </div>
        </div>
    );
}
