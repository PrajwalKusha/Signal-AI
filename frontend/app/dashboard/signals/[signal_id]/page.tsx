"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
    ArrowLeft,
    CheckCircle2,
    X,
    FileText,
    User,
    Calendar,
    MessageSquare,
    Target,
    BarChart3,
    Search,
    ExternalLink,
    TrendingUp,
    Clock,
    DollarSign,
    Database,
    Zap,
    ChevronDown,
    ChevronUp
} from "lucide-react";
import ReactMarkdown from 'react-markdown';
import { useState } from 'react';
import { EvidenceTrail } from '@/components/EvidenceTrail';

// Mock signal data (will be replaced with actual data fetching)
const mockSignals = [
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

export default function SignalDetailPage() {
    const params = useParams();
    const router = useRouter();
    const signalId = params.signal_id as string;

    // Try to find signal in sessionStorage first (for backend-generated signals)
    let signal = null;
    if (typeof window !== 'undefined') {
        const storedSignals = sessionStorage.getItem('allSignals');
        if (storedSignals) {
            const allSignals = JSON.parse(storedSignals);
            signal = allSignals.find((s: any) => s.signal_id === signalId);
        }
    }

    // Fallback to mock signals if not found in sessionStorage
    if (!signal) {
        signal = mockSignals.find(s => s.signal_id === signalId);
    }

    if (!signal) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Signal Not Found</h1>
                    <p className="text-gray-600 mb-4">The signal you're looking for doesn't exist.</p>
                    <Link href="/dashboard" className="text-[#00897B] hover:underline">
                        ← Back to Dashboard
                    </Link>
                </div>
            </div>
        );
    }

    const statusColors = {
        critical: "bg-red-100 text-red-800 border-red-200",
        high: "bg-orange-100 text-orange-800 border-orange-200",
        medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
        resolved: "bg-green-100 text-green-800 border-green-200"
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 shadow-sm">
                <div className="max-w-7xl mx-auto px-6 py-3">
                    <div className="flex items-center justify-between">
                        {/* Left: Back Button */}
                        <Link
                            href="/dashboard"
                            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors text-sm"
                        >
                            <ArrowLeft size={18} />
                            <span className="font-medium">Back to Dashboard</span>
                        </Link>

                        {/* Center: Status Badge */}
                        <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${statusColors[signal.severity as keyof typeof statusColors]}`}>
                            {signal.severity}
                        </div>

                        {/* Right: Action Buttons */}
                        <div className="flex items-center gap-2">
                            <button className="px-4 py-2 bg-[#00897B] text-white rounded-lg font-semibold hover:bg-[#00796B] transition-colors flex items-center gap-2 text-sm">
                                <CheckCircle2 size={16} />
                                Approve Strategy
                            </button>
                            <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors flex items-center gap-2 text-sm">
                                <X size={16} />
                                Reject
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-6 py-6">
                {/* Title Section */}
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">{signal.title}</h1>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1.5">
                            <Calendar size={14} />
                            <span>Detected: {signal.date}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <TrendingUp size={14} />
                            <span>Impact: {signal.impact}</span>
                        </div>
                        <div className="flex items-center gap-2 ml-2 pl-4 border-l border-gray-300">
                            <div className="flex items-center gap-1.5 text-gray-500">
                                <Database size={14} />
                                <span className="text-xs font-medium uppercase tracking-wide">Analyzed:</span>
                            </div>
                            <div className="flex gap-1.5">
                                <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-xs border border-blue-100 font-medium font-mono">sales_2025.csv</span>
                                <span className="bg-purple-50 text-purple-700 px-2 py-0.5 rounded text-xs border border-purple-100 font-medium font-mono">internal_context.txt</span>
                                <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-xs border border-gray-200 font-medium font-mono">backlog.json</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Two-Column Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Content - 2/3 width */}
                    <div className="lg:col-span-2 space-y-4">
                        {/* Executive Briefing */}
                        <section className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                            <div className="flex items-center gap-2 mb-3">
                                <FileText size={18} className="text-[#00897B]" />
                                <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Executive Briefing</h2>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 text-sm leading-relaxed text-gray-700">
                                <ReactMarkdown
                                    components={{
                                        strong: ({ node, ...props }) => <span className="font-bold text-gray-900" {...props} />,
                                        p: ({ node, ...props }) => <p className="mb-3 last:mb-0" {...props} />,
                                    }}
                                >
                                    {signal.prose}
                                </ReactMarkdown>
                            </div>
                        </section>

                        {/* Solution Architect */}
                        {signal.employee_attribution && (
                            <section className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                                <div className="flex items-center gap-2 mb-3">
                                    <User size={18} className="text-purple-600" />
                                    <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Solution Architect</h2>
                                </div>
                                <div className="bg-gradient-to-br from-purple-50 to-indigo-50 p-4 rounded-lg border border-purple-100">
                                    <div className="flex items-start gap-3 mb-3">
                                        {/* Avatar */}
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-md flex-shrink-0">
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
                                        <div className="bg-white/60 p-3 rounded-lg border border-purple-100 mb-2">
                                            <div className="text-xs font-bold text-purple-600 uppercase mb-1.5">Original Proposal</div>
                                            <p className="text-sm text-gray-700 italic leading-relaxed">
                                                "{signal.employee_attribution.proposal_quote}"
                                            </p>
                                        </div>
                                    )}

                                    {/* Submission Details */}
                                    <div className="flex items-center gap-3 text-xs text-gray-600">
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

                        {/* Strategic Response */}
                        {signal.recommendation && (
                            <section className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                                <div className="flex items-center gap-2 mb-3">
                                    <Target size={18} className="text-indigo-600" />
                                    <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Strategic Response</h2>
                                </div>

                                {/* Recommended Action */}
                                <div className="mb-4">
                                    <div className="flex items-start gap-2">
                                        <Zap size={16} className="text-indigo-600 mt-0.5 flex-shrink-0" />
                                        <div>
                                            <div className="text-xs font-bold text-indigo-600 uppercase mb-1">Recommended Action</div>
                                            <div className="text-sm font-bold text-gray-900">{signal.recommendation.project_title}</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Metrics Grid */}
                                <div className="grid grid-cols-3 gap-3 mb-4">
                                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-3 rounded-lg border border-green-100">
                                        <div className="text-xs font-bold text-green-700 uppercase mb-1">Projected Impact</div>
                                        <div className="text-xl font-bold text-gray-900">
                                            {typeof signal.recommendation.impact_usd === 'number'
                                                ? (signal.recommendation.impact_usd > 1000000
                                                    ? `$${(signal.recommendation.impact_usd / 1000000).toFixed(2)}M`
                                                    : `$${(signal.recommendation.impact_usd / 1000).toFixed(0)}k`)
                                                : signal.recommendation.impact_usd}
                                        </div>
                                        <div className="text-xs text-gray-600">Annual</div>
                                    </div>
                                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-3 rounded-lg border border-blue-100">
                                        <div className="text-xs font-bold text-blue-700 uppercase mb-1">ROI Multiple</div>
                                        <div className="text-xl font-bold text-gray-900">{signal.recommendation.roi_metric}</div>
                                        <div className="text-xs text-gray-600">Return</div>
                                    </div>
                                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-3 rounded-lg border border-purple-100">
                                        <div className="text-xs font-bold text-purple-700 uppercase mb-1">Feasibility Score</div>
                                        <div className="text-xl font-bold text-gray-900">{signal.recommendation.feasibility_score}/10</div>
                                        <div className="text-xs text-gray-600">
                                            <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                                                <div
                                                    className="bg-purple-600 h-1.5 rounded-full"
                                                    style={{ width: `${signal.recommendation.feasibility_score * 10}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Technical Spec */}
                                <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                                    <div className="text-xs font-bold text-gray-700 uppercase mb-1.5">Technical Specification</div>
                                    <p className="text-sm text-gray-700 leading-relaxed">{signal.recommendation.technical_spec}</p>
                                </div>
                            </section>
                        )}

                        {/* Market Intelligence */}
                        {signal.recommendation?.market_context && (
                            <MarketIntelligenceSection context={signal.recommendation.market_context} />
                        )}

                        {/* Internal Context */}
                        <section className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                            <div className="flex items-center gap-2 mb-3">
                                <MessageSquare size={18} className="text-gray-600" />
                                <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Internal Context</h2>
                            </div>
                            <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                                <div className="text-xs font-bold text-gray-700 uppercase mb-1.5">Data Source</div>
                                <p className="text-sm text-gray-700">{signal.context_source}</p>
                            </div>
                        </section>

                        {/* Evidence Trail */}
                        <EvidenceTrail signal={signal} />
                    </div>

                    {/* Sidebar - 1/3 width */}
                    <div className="lg:col-span-1 space-y-4">
                        {/* Quick Actions */}
                        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wide mb-3">Quick Actions</h3>
                            <div className="space-y-2">
                                <button className="w-full px-3 py-2 bg-[#00897B] text-white rounded-lg font-semibold hover:bg-[#00796B] transition-colors text-sm">
                                    Approve Strategy
                                </button>
                                <button className="w-full px-3 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors text-sm">
                                    Request More Info
                                </button>
                                <button className="w-full px-3 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors text-sm">
                                    Archive Signal
                                </button>
                            </div>
                        </div>

                        {/* Key Metrics Summary */}
                        {signal.recommendation && (
                            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                                <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wide mb-3">Key Metrics</h3>
                                <div className="space-y-3">
                                    <div>
                                        <div className="flex items-center gap-1.5 mb-1">
                                            <DollarSign size={14} className="text-green-600" />
                                            <span className="text-xs font-bold text-gray-700 uppercase">ROI</span>
                                        </div>
                                        <div className="text-xl font-bold text-gray-900">{signal.recommendation.roi_metric}</div>
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-1.5 mb-1">
                                            <TrendingUp size={14} className="text-blue-600" />
                                            <span className="text-xs font-bold text-gray-700 uppercase">Impact</span>
                                        </div>
                                        <div className="text-xl font-bold text-gray-900">${(signal.recommendation.impact_usd / 1000000).toFixed(2)}M</div>
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-1.5 mb-1">
                                            <BarChart3 size={14} className="text-purple-600" />
                                            <span className="text-xs font-bold text-gray-700 uppercase">Feasibility</span>
                                        </div>
                                        <div className="text-xl font-bold text-gray-900">{signal.recommendation.feasibility_score}/10</div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Timeline */}
                        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wide mb-3">Timeline</h3>
                            <div className="space-y-2.5">
                                <div className="flex items-start gap-2.5">
                                    <div className="w-2 h-2 rounded-full bg-green-500 mt-1"></div>
                                    <div>
                                        <div className="text-xs font-bold text-gray-900">Signal Detected</div>
                                        <div className="text-xs text-gray-600">{signal.date}</div>
                                    </div>
                                </div>
                                <div className="flex items-start gap-2.5">
                                    <div className="w-2 h-2 rounded-full bg-blue-500 mt-1"></div>
                                    <div>
                                        <div className="text-xs font-bold text-gray-900">Analysis Complete</div>
                                        <div className="text-xs text-gray-600">{signal.date}</div>
                                    </div>
                                </div>
                                <div className="flex items-start gap-2.5">
                                    <div className="w-2 h-2 rounded-full bg-gray-300 mt-1"></div>
                                    <div>
                                        <div className="text-xs font-bold text-gray-400">Awaiting Decision</div>
                                        <div className="text-xs text-gray-400">Pending</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function MarketIntelligenceSection({ context }: { context: string }) {
    const [isExpanded, setIsExpanded] = useState(false);
    const shouldTruncate = context.length > 300;

    return (
        <section className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <div className="flex items-center gap-2 mb-3">
                <Search size={18} className="text-amber-600" />
                <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Market Intelligence</h2>
            </div>
            <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
                <div className={`text-sm text-gray-700 leading-relaxed ${!isExpanded && shouldTruncate ? 'line-clamp-3' : ''}`}>
                    {context}
                </div>

                {shouldTruncate && (
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="flex items-center gap-1 text-xs font-bold text-amber-700 mt-2 hover:text-amber-800 transition-colors"
                    >
                        {isExpanded ? (
                            <>Show Less <ChevronUp size={14} /></>
                        ) : (
                            <>Read More <ChevronDown size={14} /></>
                        )}
                    </button>
                )}

                <div className="flex items-center gap-2 mt-3 text-xs text-amber-700 pt-2 border-t border-amber-200/50">
                    <ExternalLink size={12} />
                    <span>Source: Tavily Market Research</span>
                </div>
            </div>
        </section>
    );
}
