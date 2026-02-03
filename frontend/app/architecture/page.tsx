import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, Zap, Database, Search, FileText } from 'lucide-react';

export default function ArchitecturePage() {
    return (
        <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-teal-100 selection:text-teal-900">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
                <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
                    <Link href="/dashboard" className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors font-medium">
                        <ChevronLeft size={18} />
                        Back to Dashboard
                    </Link>
                    <div className="flex items-center gap-2 text-sm font-bold text-teal-600 uppercase tracking-wider">
                        <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse"></span>
                        Nexus Intelligence
                    </div>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-6 py-12 md:py-20">
                {/* Hero */}
                <div className="mb-16">
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 mb-6">
                        Nexus Swarm: <br />
                        <span className="text-teal-600">The Architecture of Intelligence</span>
                    </h1>
                    <p className="text-xl text-slate-600 leading-relaxed max-w-3xl">
                        Engineering a Proactive Enterprise through Multi-Agent Orchestration.
                        How we transform raw data into actionable executive memos in under 90 seconds.
                    </p>
                </div>

                {/* Diagram */}
                <div className="mb-20 p-4 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="relative w-full aspect-[16/9] md:aspect-[2/1] min-h-[300px]">
                        <Image
                            src="/images/nexus-architecture.png"
                            alt="Nexus Swarm Architecture Diagram"
                            fill
                            className="object-contain"
                        />
                    </div>
                    <p className="text-center text-sm text-slate-500 mt-4 italic">
                        Figure 1: The sequential-cyclical LangGraph workflow.
                    </p>
                </div>

                {/* Content Sections */}
                <div className="prose prose-slate prose-lg max-w-none space-y-16">

                    {/* Section 1: Philosophy */}
                    <section>
                        <h2 className="text-3xl font-bold text-slate-900 mb-6">System Philosophy</h2>
                        <p>
                            In the traditional enterprise, data is siloed: Numbers live in CSVs, context lives in Slack, and solutions live in backlogs.
                            <strong> Nexus Swarm</strong> uses a <code className="text-sm bg-slate-100 px-1 py-0.5 rounded font-mono text-pink-600">LangGraph</code>-powered stateful workflow to bridge these silos.
                        </p>
                    </section>

                    {/* Section 2: Four Agents */}
                    <section>
                        <h2 className="text-3xl font-bold text-slate-900 mb-8">The Core Engine: The 4-Agent Workflow</h2>
                        <p className="mb-8">
                            Our architecture utilizes a sequential-cyclical graph where each agent is a specialized LLM node with access to specific tools.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 not-prose">
                            {/* Agent 1 */}
                            <div className="p-6 bg-slate-50 rounded-xl border border-slate-200 hover:border-blue-400 transition-colors group">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-blue-100 text-blue-600 rounded-lg group-hover:scale-110 transition-transform">
                                        <Zap size={24} />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900">1. The Analyst Agent</h3>
                                </div>
                                <div className="space-y-2 text-sm text-slate-600">
                                    <p><strong className="text-slate-900">Persona:</strong> Senior Data Scientist</p>
                                    <p><strong className="text-slate-900">Tech:</strong> Python REPL / Code Interpreter</p>
                                    <p className="border-t border-slate-200 pt-2 mt-2 leading-relaxed">
                                        The Analyst doesn't just read data; it writes and executes Python code against your 1,000-row sales_2025.csv. It identifies statistical anomalies (Revenue Drops &gt;20%, Growth &gt;50%) and extracts raw evidence rows.
                                    </p>
                                </div>
                            </div>

                            {/* Agent 2 */}
                            <div className="p-6 bg-slate-50 rounded-xl border border-slate-200 hover:border-amber-400 transition-colors group">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-amber-100 text-amber-600 rounded-lg group-hover:scale-110 transition-transform">
                                        <Search size={24} />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900">2. The Investigator Agent</h3>
                                </div>
                                <div className="space-y-2 text-sm text-slate-600">
                                    <p><strong className="text-slate-900">Persona:</strong> Forensic Internal Auditor</p>
                                    <p><strong className="text-slate-900">Tech:</strong> Semantic Search & Contextual RAG</p>
                                    <p className="border-t border-slate-200 pt-2 mt-2 leading-relaxed">
                                        Once an anomaly is detected, it scans internal_context.txt (Slack, Emails). It performs <strong>Employee Attribution</strong>, identifying the "Champion" who is already finding the fix.
                                    </p>
                                </div>
                            </div>

                            {/* Agent 3 */}
                            <div className="p-6 bg-slate-50 rounded-xl border border-slate-200 hover:border-purple-400 transition-colors group">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-purple-100 text-purple-600 rounded-lg group-hover:scale-110 transition-transform">
                                        <Database size={24} />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900">3. The Strategist Agent</h3>
                                </div>
                                <div className="space-y-2 text-sm text-slate-600">
                                    <p><strong className="text-slate-900">Persona:</strong> Chief Transformation Officer</p>
                                    <p><strong className="text-slate-900">Tech:</strong> Financial Reasoning & Tavily Search</p>
                                    <p className="border-t border-slate-200 pt-2 mt-2 leading-relaxed">
                                        Maps the problem (Analyst) and reason (Investigator) to your transformation_backlog.json. Calculates Deterministic ROI using a Python math engine.
                                    </p>
                                </div>
                            </div>

                            {/* Agent 4 */}
                            <div className="p-6 bg-slate-50 rounded-xl border border-slate-200 hover:border-emerald-400 transition-colors group">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg group-hover:scale-110 transition-transform">
                                        <FileText size={24} />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900">4. The Ghostwriter Agent</h3>
                                </div>
                                <div className="space-y-2 text-sm text-slate-600">
                                    <p><strong className="text-slate-900">Persona:</strong> Executive Ghostwriter</p>
                                    <p><strong className="text-slate-900">Tech:</strong> Advanced LLM Synthesis</p>
                                    <p className="border-t border-slate-200 pt-2 mt-2 leading-relaxed">
                                        Performs "Narrative Compression." Synthesis everything into a high-density executive brief: Clear Problem, Clear Solution, Clear ROI, highlighting the employee.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Section 3: Data Handshake */}
                    <section>
                        <h2 className="text-3xl font-bold text-slate-900 mb-6">The Data "Handshake"</h2>
                        <p className="mb-6">Nexus Swarm operates at the intersection of three distinct data modalities:</p>
                        <ul className="space-y-4 list-disc pl-5 text-slate-700">
                            <li><strong className="text-slate-900">Structured:</strong> Time-series sales data (CSV).</li>
                            <li><strong className="text-slate-900">Unstructured:</strong> Human chatter and corporate logs (TXT).</li>
                            <li><strong className="text-slate-900">Semi-Structured:</strong> Strategic project backlogs (JSON).</li>
                        </ul>
                    </section>

                    {/* Section 4: Why LangGraph */}
                    <section className="bg-slate-900 text-slate-300 p-8 rounded-2xl relative overflow-hidden">
                        <div className="relative z-10">
                            <h2 className="text-2xl font-bold text-white mb-4">Why LangGraph?</h2>
                            <p className="leading-relaxed">
                                Unlike standard linear chains, LangGraph allows our swarm to maintain a <strong className="text-teal-400">Shared State</strong>.
                                If the Analyst finds a revenue drop, that specific "State" (Date, Region, Segment) is passed to the Investigator.
                                This ensures that the context found in Slack is mathematically relevant to the numbers in the CSV.
                            </p>
                        </div>
                        <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-teal-600 rounded-full blur-[100px] opacity-20"></div>
                    </section>
                </div>
            </main>
        </div>
    );
}
