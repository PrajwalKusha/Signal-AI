"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { SignalCard } from "@/components/SignalCard";
import {
    Terminal,
    CheckCircle2,
    Loader2,
    Sparkles,
    Search,
    Filter,
    Plus,
    LayoutGrid,
    List,
    MoreHorizontal,
    Play,
    Activity,
    Server,
    Cpu
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Mock previous signals
const mockPreviousSignals = [
    {
        signal_id: "SIG-EMEA-001",
        title: "Q4 Revenue Anomaly - EMEA Region",
        summary: "15% revenue drop detected in EMEA region during Q4 2024. Analysis revealed market saturation and increased competition from local vendors.",
        prose: "Detailed analysis shows a 15% revenue decline in the EMEA region during Q4 2024. Primary factors include market saturation in key territories and increased competitive pressure from local vendors who have adapted pricing strategies. Customer feedback indicates price sensitivity has increased by 23% compared to Q3.",
        severity: "high",
        date: "2025-01-15",
        status: "resolved",
        impact: "$1.2M revenue impact",
        context_source: "Sales Analytics Dashboard + Customer Feedback Survey",
        recommendation: {
            project_title: "Localized Pricing Strategy (TRANS-045)",
            roi_metric: "3.2x",
            impact_usd: 1200000,
            market_context: "Local competitors have introduced tiered pricing models that better align with regional purchasing power. Market research shows 67% of EMEA customers prefer flexible pricing.",
            feasibility_score: 7,
            technical_spec: "Implement dynamic pricing engine with regional adjustment factors"
        },
        employee_attribution: {
            name: "Lukas Weber",
            department: "EMEA Sales",
            proposal_quote: "We need flexible pricing tiers that match regional purchasing power. Our current one-size-fits-all approach is losing deals to local competitors.",
            submission_date: "2024-12-20",
            submission_channel: "Slack #emea-sales"
        }
    },
    {
        signal_id: "SIG-CHURN-002",
        title: "Customer Churn Spike - Enterprise Tier",
        summary: "Unusual 8% increase in enterprise customer churn rate detected in December 2024. Primary factors include delayed feature releases and support response times.",
        prose: "Enterprise customer churn increased by 8% in December 2024, significantly above the baseline of 2-3%. Exit interviews revealed two primary concerns: delayed delivery of promised features (mentioned by 67% of churned accounts) and support response times averaging 4.2 hours vs. the SLA of 2 hours. At-risk accounts total 12 with combined ARR of $2.4M.",
        severity: "medium",
        date: "2025-01-10",
        status: "resolved",
        impact: "12 enterprise accounts at risk",
        context_source: "Exit Interview Database + Support Ticket Analytics",
        recommendation: {
            project_title: "Enterprise Support Acceleration (TRANS-052)",
            roi_metric: "5.8x",
            impact_usd: 2400000,
            market_context: "Industry benchmark for enterprise support response time is 1.5 hours. Competitors are offering dedicated account managers for enterprise tiers, which has become table stakes.",
            feasibility_score: 9,
            technical_spec: "Deploy 24/7 dedicated support team with SLA monitoring dashboard"
        },
        employee_attribution: {
            name: "Sarah Chen",
            department: "Customer Success",
            proposal_quote: "Enterprise customers are leaving because of slow support response times. We need dedicated account managers and 24/7 coverage to compete.",
            submission_date: "2024-12-28",
            submission_channel: "Slack #customer-success"
        }
    }
];

export default function Dashboard() {
    const [gatheringSignals, setGatheringSignals] = useState(false);
    const [signalsGenerated, setSignalsGenerated] = useState(false);
    const [signals, setSignals] = useState<any[]>([]);
    const [logs, setLogs] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    // Load signals from sessionStorage on mount
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const storedSignals = sessionStorage.getItem('signals');
            if (storedSignals) {
                try {
                    const allSignals = JSON.parse(storedSignals);
                    // Separate today's signals from previous signals
                    if (allSignals.length > 0) {
                        setSignals(allSignals);
                        setSignalsGenerated(true);
                    }
                } catch (e) {
                    console.error('Error loading signals from sessionStorage:', e);
                }
            }
        }
    }, []); // Run once on mount

    // Poll for logs when running
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (loading) {
            interval = setInterval(() => {
                const statusMessages = [
                    "[Analyst] Scanning sales_2025.csv for statistical anomalies...",
                    "[Analyst] ⚠️ Detected: Revenue Drop > 30% in APAC region.",
                    "[Investigator] Cross-referencing internal wikis...",
                    "[Investigator] Found context: 'Zenith Labs Acquisition' (Source: Slack)",
                    "[Strategist] Calculating Cost of Inaction... $2.45M detected.",
                    "[Strategist] Searching transformation backlog for solutions...",
                    "[Strategist] Match found: 'AI Competitive Switch-Kit' (TRANS-001)",
                    "[Ghostwriter] Drafting executive summary...",
                ];
                const randomMsg = statusMessages[Math.floor(Math.random() * statusMessages.length)];
                setLogs(prev => {
                    if (prev[prev.length - 1] !== randomMsg && prev.length < 8) return [...prev, randomMsg];
                    return prev;
                });
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [loading]);

    const handleGatherSignals = async () => {
        setGatheringSignals(true);
        setLoading(true);
        setLogs([]);
        setSignals([]); // Clear previous signals

        try {
            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

            const response = await fetch(`${API_URL}/api/audit`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({}) // Can pass custom file names here if needed
            });

            if (!response.ok) {
                throw new Error(`Backend error: ${response.status} ${response.statusText}`);
            }

            if (!response.body) {
                throw new Error("No response body received");
            }

            // Stream Reader
            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let buffer = '';

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                buffer += decoder.decode(value, { stream: true });
                const lines = buffer.split('\n');

                // Process all complete lines
                buffer = lines.pop() || ''; // Keep the last incomplete line in buffer

                for (const line of lines) {
                    if (!line.trim()) continue;

                    try {
                        const event = JSON.parse(line);

                        if (event.type === 'log') {
                            setLogs(prev => {
                                // Keep only last 8 logs
                                const newLogs = [...prev, event.message];
                                return newLogs.slice(-8);
                            });
                        } else if (event.type === 'result') {
                            const signalsArray = event.data;
                            setSignals(signalsArray);
                            setSignalsGenerated(true);

                            // Save to sessionStorage
                            if (typeof window !== 'undefined') {
                                const storedSignals = sessionStorage.getItem('signals');
                                const prevSignals = storedSignals ? JSON.parse(storedSignals) : [];
                                // Deduplicate by ID
                                const newSignalIds = new Set(signalsArray.map((s: any) => s.signal_id));
                                const merged = [...prevSignals.filter((s: any) => !newSignalIds.has(s.signal_id)), ...signalsArray];
                                sessionStorage.setItem('signals', JSON.stringify(merged));
                            }
                        } else if (event.type === 'error') {
                            throw new Error(event.message);
                        }
                    } catch (e) {
                        console.error("Error parsing stream line:", line, e);
                    }
                }
            }

        } catch (error) {
            console.error('Failed to gather signals:', error);
            setLoading(false);
            setSignalsGenerated(false);
            setLogs(prev => [...prev, `❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`]);
        } finally {
            setLoading(false);
            setGatheringSignals(false);
        }
    };


    return (
        <div className="space-y-6">
            {/* Header with Background Image */}
            <div className="relative rounded-2xl overflow-hidden bg-white shadow-sm h-64 md:h-80 group">
                <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                    style={{ backgroundImage: "url('/dashboard-bg.jpg')" }}
                >
                    {/* Overlay gradient for readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                </div>

                {/* Bottom Left Content Box */}
                <div className="absolute bottom-6 left-6 md:bottom-8 md:left-8 max-w-lg">
                    <div className="bg-black/30 backdrop-blur-md rounded-xl p-6 border border-white/10 text-white shadow-lg">
                        <div className="flex items-center gap-2 text-xs font-bold text-teal-300 mb-2 uppercase tracking-wider">
                            <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse"></span>
                            Live System
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight text-white shadow-sm">
                            Nexus Flow Intelligence
                        </h1>

                        <div className="flex items-center gap-6 text-sm font-medium text-white/90">
                            <div>
                                <span className="text-white/60 block text-xs uppercase tracking-wide mb-0.5">Active Signals</span>
                                <span className="text-lg font-bold">4,029</span>
                            </div>
                            <div className="w-px h-8 bg-white/20"></div>
                            <div>
                                <span className="text-white/60 block text-xs uppercase tracking-wide mb-0.5">Region</span>
                                <span className="text-lg font-bold">Global</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters & Actions Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 py-2">
                <div className="flex items-center gap-3 flex-1">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search signals..."
                            className="w-full bg-white border border-gray-100 rounded-lg py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-[#B2DFDB] focus:border-[#00897B] transition-all shadow-sm"
                        />
                    </div>
                    <button className="p-2.5 bg-white border border-gray-100 rounded-lg text-gray-500 hover:bg-gray-50 hover:text-[#00897B] transition-colors shadow-sm">
                        <Filter size={18} />
                    </button>
                </div>

                <button
                    onClick={handleGatherSignals}
                    className="flex items-center gap-2 bg-[#00897B] hover:bg-[#00796B] text-white px-6 py-3 rounded-lg text-sm font-bold shadow-md shadow-teal-900/10 transition-all hover:scale-105"
                >
                    <Plus size={18} />
                    <span>Gather Signals</span>
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Signal Gathering State */}
                    <AnimatePresence>
                        {gatheringSignals && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                            >
                                <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm">
                                    <div className="bg-gray-900 px-4 py-3 flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-white font-medium text-sm">
                                            <Terminal size={16} className="text-teal-400" />
                                            <span>Agent Activity Log</span>
                                        </div>
                                        {loading ? (
                                            <div className="flex items-center gap-2 text-teal-400 text-xs font-semibold">
                                                <Loader2 size={14} className="animate-spin" />
                                                Processing
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold">
                                                <CheckCircle2 size={14} />
                                                Complete
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-4 h-48 overflow-y-auto space-y-2 font-mono text-xs bg-gray-900">
                                        {logs.map((log, i) => (
                                            <motion.div
                                                key={i}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                className="text-gray-300"
                                            >
                                                <span className="text-gray-500 mr-2">{new Date().toLocaleTimeString()}</span>
                                                {log}
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Empty State - Resized (Compact) */}
                    {!gatheringSignals && !signalsGenerated && (
                        <div className="bg-white border-2 border-dashed border-gray-100 rounded-xl p-8 text-center hover:border-teal-100 transition-colors">
                            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-teal-50 flex items-center justify-center">
                                <Sparkles className="w-6 h-6 text-[#00897B]" />
                            </div>
                            <h3 className="text-base font-bold text-gray-900 mb-1">No new signals today</h3>
                            <p className="text-sm text-gray-400 mb-4 max-w-xs mx-auto">
                                All systems normal. Run manual analysis if needed.
                            </p>
                        </div>
                    )}

                    {/* Today's Generated Signals */}
                    <AnimatePresence>
                        {signalsGenerated && signals.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="space-y-4"
                            >
                                <div className="flex items-center justify-between">
                                    <h3 className="font-bold text-gray-900">Today's Signals</h3>
                                    <span className="bg-teal-50 text-[#00796B] text-xs font-bold px-2 py-0.5 rounded-full border border-teal-100">New Results</span>
                                </div>
                                {signals.map((signal: any, idx: number) => (
                                    <Link key={idx} href={`/dashboard/signals/${signal.signal_id}`}>
                                        <SignalCard signal={signal} />
                                    </Link>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Previous Signals - More Compact Grid or List */}
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden py-2 border border-gray-100/50">
                        <div className="px-5 py-3 flex items-center justify-between">
                            <h3 className="font-bold text-gray-900">Previous Signals</h3>
                            <div className="flex gap-2 text-gray-400">
                                <button className="hover:text-teal-600 transition-colors"><List size={18} /></button>
                            </div>
                        </div>
                        <div className="px-5 pb-5 space-y-3">
                            {mockPreviousSignals.map((signal, idx) => (
                                <Link key={idx} href={`/dashboard/signals/${signal.signal_id}`}>
                                    <SignalCard signal={signal} />
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column - Widgets */}
                <div className="space-y-6">
                    {/* System Status Widget (Replacing Calendar) */}
                    <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100/50">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-gray-900 flex items-center gap-2">
                                <Activity size={18} className="text-[#00897B]" />
                                System Health
                            </h3>
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                        </div>

                        <div className="space-y-4">
                            <div className="group flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-default">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center text-[#00897B]">
                                        <Server size={16} />
                                    </div>
                                    <div>
                                        <div className="text-sm font-bold text-gray-900">Data Pipeline</div>
                                        <div className="text-xs text-gray-400">Up and running</div>
                                    </div>
                                </div>
                                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">99.9%</span>
                            </div>

                            <div className="group flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-default">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600">
                                        <Cpu size={16} />
                                    </div>
                                    <div>
                                        <div className="text-sm font-bold text-gray-900">Agent Core</div>
                                        <div className="text-xs text-gray-400">Processing idle</div>
                                    </div>
                                </div>
                                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">Active</span>
                            </div>
                        </div>
                    </div>

                    {/* Stats Widget */}
                    <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100/50">
                        <h3 className="font-bold text-gray-900 mb-4">Quick Stats</h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-500">Total Signals</span>
                                <span className="font-bold text-gray-900">42</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-500">Critical</span>
                                <span className="font-bold text-red-600">3</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-500">Resolved</span>
                                <span className="font-bold text-emerald-600">35</span>
                            </div>
                            <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden mt-2">
                                <div className="bg-[#00897B] h-full w-[85%] rounded-full"></div>
                            </div>
                            <div className="text-xs text-right text-gray-400">85% Resolution Rate</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
