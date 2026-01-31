"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, AlertTriangle, TrendingDown, DollarSign, User, Sparkles } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { motion } from "framer-motion";

// Mock signal data - in production this would come from API
const MOCK_SIGNALS = {
    "1": {
        id: "1",
        title: "APAC Revenue Collapse: Zenith Labs Migration Crisis",
        severity: "CRITICAL",
        region: "APAC",
        costOfInaction: 2450000,
        dateDiscovered: "2025-01-15",
        status: "Active",
        anomalyData: [
            { month: "Jul", revenue: 850000, normal: 850000 },
            { month: "Aug", revenue: 920000, normal: 900000 },
            { month: "Sep", revenue: 880000, normal: 920000 },
            { month: "Oct", revenue: 650000, normal: 940000 }, // Anomaly starts
            { month: "Nov", revenue: 580000, normal: 960000 },
            { month: "Dec", revenue: 520000, normal: 980000 },
        ],
        contextExcerpts: [
            {
                source: "Slack #sales-apac",
                text: "Lost another Enterprise deal to GlobalStack. Customer cited 'no clear migration path from Zenith Labs' as the dealbreaker.",
                date: "2025-01-10"
            },
            {
                source: "Internal Wiki",
                text: "Zenith Labs acquisition by GlobalStack creating competitive pressure in APAC. Need migration toolkit ASAP.",
                date: "2025-01-08"
            },
            {
                source: "Sales Call Notes",
                text: "Prospect mentioned GlobalStack's automated migration tool as key differentiator. We have nothing comparable.",
                date: "2025-01-12"
            }
        ],
        solution: {
            title: "AI Competitive Switch-Kit",
            transformationId: "TRANS-001",
            author: "Sarah Chen, Director of Sales Ops",
            department: "Sales",
            implementationCost: 450000,
            projectedSavings: 2450000,
            roi: 444,
            description: "RAG-based agent trained on competitor pricing models and migration friction to automate customer transitions from Zenith Labs.",
            complexity: 40,
            timeline: "8-12 weeks"
        }
    }
};

export default function SignalDetailPage() {
    const params = useParams();
    const router = useRouter();
    const signalId = params.id as string;

    const signal = MOCK_SIGNALS[signalId as keyof typeof MOCK_SIGNALS];

    if (!signal) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-white mb-2">Signal Not Found</h2>
                    <p className="text-slate-400">The requested signal does not exist.</p>
                </div>
            </div>
        );
    }

    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case "CRITICAL": return "from-red-500 to-orange-500";
            case "HIGH": return "from-orange-500 to-yellow-500";
            case "MEDIUM": return "from-yellow-500 to-emerald-500";
            default: return "from-slate-500 to-slate-600";
        }
    };

    return (
        <div className="max-w-7xl mx-auto p-8">
            {/* Back Button */}
            <button
                onClick={() => router.back()}
                className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-6"
            >
                <ArrowLeft size={20} />
                <span>Back to Command Center</span>
            </button>

            {/* Signal Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                            <div className={`px-3 py-1 bg-gradient-to-r ${getSeverityColor(signal.severity)} rounded-full text-white text-xs font-bold`}>
                                {signal.severity}
                            </div>
                            <div className="px-3 py-1 bg-slate-800 border border-slate-700 rounded-full text-slate-300 text-xs font-medium">
                                {signal.region}
                            </div>
                            <div className="px-3 py-1 bg-emerald-500/20 border border-emerald-500/30 rounded-full text-emerald-400 text-xs font-medium">
                                {signal.status}
                            </div>
                        </div>
                        <h1 className="text-3xl font-bold text-white mb-2">{signal.title}</h1>
                        <p className="text-slate-400">Discovered on {new Date(signal.dateDiscovered).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                        <div className="text-sm text-slate-400 mb-1">Cost of Inaction</div>
                        <div className="text-3xl font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
                            ${(signal.costOfInaction / 1000000).toFixed(2)}M
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Context Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mb-8"
            >
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-cyan-500/50">
                        <TrendingDown className="text-white" size={20} />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white">Anomaly Context</h2>
                        <p className="text-sm text-slate-400">Revenue trend analysis and supporting evidence</p>
                    </div>
                </div>

                {/* Revenue Chart */}
                <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 mb-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Revenue Trend (Last 6 Months)</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={signal.anomalyData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                            <XAxis dataKey="month" stroke="#94a3b8" />
                            <YAxis stroke="#94a3b8" tickFormatter={(value) => `$${(value / 1000)}K`} />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '8px' }}
                                labelStyle={{ color: '#e2e8f0' }}
                            />
                            <ReferenceLine x="Oct" stroke="#ef4444" strokeDasharray="3 3" label={{ value: "Anomaly Detected", fill: "#ef4444", position: "top" }} />
                            <Line type="monotone" dataKey="normal" stroke="#64748b" strokeWidth={2} name="Expected" strokeDasharray="5 5" />
                            <Line type="monotone" dataKey="revenue" stroke="#06b6d4" strokeWidth={3} name="Actual" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Context Excerpts */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white">Supporting Evidence</h3>
                    {signal.contextExcerpts.map((excerpt, idx) => (
                        <div key={idx} className="bg-slate-800 border border-slate-700 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-cyan-400">{excerpt.source}</span>
                                <span className="text-xs text-slate-500">{new Date(excerpt.date).toLocaleDateString()}</span>
                            </div>
                            <p className="text-slate-300 leading-relaxed">{excerpt.text}</p>
                        </div>
                    ))}
                </div>
            </motion.div>

            {/* Solution Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
            >
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-500/50">
                        <Sparkles className="text-white" size={20} />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white">Recommended Solution</h2>
                        <p className="text-sm text-slate-400">AI-matched transformation from backlog</p>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-xl p-6">
                    <div className="flex items-start justify-between mb-6">
                        <div>
                            <h3 className="text-2xl font-bold text-white mb-2">{signal.solution.title}</h3>
                            <p className="text-slate-400 mb-4">{signal.solution.description}</p>
                            <div className="flex items-center gap-2 text-sm">
                                <User className="text-violet-400" size={16} />
                                <span className="text-slate-300">Suggested by</span>
                                <span className="text-violet-400 font-medium">{signal.solution.author}</span>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-sm text-slate-400 mb-1">ROI</div>
                            <div className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                                {signal.solution.roi}%
                            </div>
                        </div>
                    </div>

                    {/* ROI Breakdown */}
                    <div className="grid md:grid-cols-3 gap-4 mb-6">
                        <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <DollarSign className="text-red-400" size={16} />
                                <span className="text-sm text-slate-400">Implementation Cost</span>
                            </div>
                            <div className="text-2xl font-bold text-white">
                                ${(signal.solution.implementationCost / 1000).toFixed(0)}K
                            </div>
                        </div>
                        <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <DollarSign className="text-emerald-400" size={16} />
                                <span className="text-sm text-slate-400">Projected Savings</span>
                            </div>
                            <div className="text-2xl font-bold text-white">
                                ${(signal.solution.projectedSavings / 1000000).toFixed(2)}M
                            </div>
                        </div>
                        <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <AlertTriangle className="text-yellow-400" size={16} />
                                <span className="text-sm text-slate-400">Timeline</span>
                            </div>
                            <div className="text-2xl font-bold text-white">
                                {signal.solution.timeline}
                            </div>
                        </div>
                    </div>

                    {/* Action Button */}
                    <button className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-bold py-3 px-6 rounded-lg hover:from-emerald-600 hover:to-cyan-600 transition-all shadow-lg shadow-emerald-500/30">
                        Create Implementation Ticket
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
