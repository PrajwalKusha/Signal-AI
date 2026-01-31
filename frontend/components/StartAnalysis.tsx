"use client";

import { useState } from "react";
import { Upload, FileText, Play, Loader2, Sparkles } from "lucide-react";

interface StartAnalysisProps {
    onComplete: (data: any) => void;
}

export function StartAnalysis({ onComplete }: StartAnalysisProps) {
    const [mode, setMode] = useState<"select" | "upload" | "processing">("select");
    const [files, setFiles] = useState<{
        sales: File | null;
        context: File | null;
        backlog: File | null;
    }>({ sales: null, context: null, backlog: null });

    const handleDemo = async () => {
        setMode("processing");
        try {
            const res = await fetch("http://localhost:8000/api/audit", { method: "POST" });
            const json = await res.json();
            onComplete(json.report);
        } catch (e) {
            console.error(e);
            setMode("select");
        }
    };

    const handleCustom = async () => {
        if (!files.sales || !files.context || !files.backlog) return;
        setMode("processing");

        try {
            const formData = new FormData();
            formData.append("sales", files.sales);
            formData.append("context", files.context);
            formData.append("backlog", files.backlog);

            const uploadRes = await fetch("http://localhost:8000/api/upload", {
                method: "POST",
                body: formData,
            });
            const uploadJson = await uploadRes.json();

            if (uploadJson.status !== "success") throw new Error("Upload failed");

            const res = await fetch("http://localhost:8000/api/audit", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(uploadJson.filenames),
            });
            const json = await res.json();
            onComplete(json.report);
        } catch (e) {
            console.error(e);
            alert("Analysis failed. See console.");
            setMode("upload");
        }
    };

    if (mode === "processing") {
        return (
            <div className="flex flex-col items-center justify-center py-20 animate-in fade-in">
                <div className="relative mb-6">
                    <div className="absolute inset-0 bg-cyan-500/20 blur-xl rounded-full" />
                    <Loader2 className="relative w-12 h-12 text-cyan-400 animate-spin" />
                </div>
                <h2 className="text-xl font-bold text-white mb-2">Running Agentic Workflow...</h2>
                <p className="text-slate-400">Analyzing Sales CSV • Scanning Context • Matching Backlog</p>
            </div>
        );
    }

    if (mode === "upload") {
        return (
            <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-cyan-500/50">
                        <Upload className="text-white" size={20} />
                    </div>
                    <h2 className="text-2xl font-bold text-white">Upload Project Files</h2>
                </div>

                <div className="space-y-4 mb-8">
                    <FileInput label="Sales Data (CSV)" onChange={(f) => setFiles({ ...files, sales: f })} />
                    <FileInput label="Context Log (TXT)" onChange={(f) => setFiles({ ...files, context: f })} />
                    <FileInput label="Transformation Backlog (JSON)" onChange={(f) => setFiles({ ...files, backlog: f })} />
                </div>

                <div className="flex gap-4">
                    <button
                        onClick={() => setMode("select")}
                        className="px-6 py-3 text-slate-300 font-medium hover:bg-slate-700 rounded-lg transition-colors border border-slate-700"
                    >
                        Back
                    </button>
                    <button
                        onClick={handleCustom}
                        disabled={!files.sales || !files.context || !files.backlog}
                        className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:from-cyan-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/30 transition-all"
                    >
                        <Play className="w-4 h-4" /> Run Analysis
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="grid md:grid-cols-2 gap-6 p-6">
            <button
                onClick={handleDemo}
                className="group relative p-8 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-slate-700 hover:border-emerald-500/50 transition-all text-left overflow-hidden"
            >
                {/* Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/0 via-emerald-500/0 to-emerald-500/0 group-hover:from-emerald-500/10 group-hover:via-emerald-500/5 group-hover:to-transparent transition-all duration-500" />

                {/* Shine Effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
                </div>

                <div className="relative z-10">
                    <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-emerald-500/50 group-hover:scale-110 transition-transform">
                        <Play className="text-white" size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">Run Demo Audit</h3>
                    <p className="text-slate-400 leading-relaxed">
                        Use the pre-loaded "Red Thread" dataset (Sales Drop, Context Log, Backlog) to see the agent in action.
                    </p>
                </div>
            </button>

            <button
                onClick={() => setMode("upload")}
                className="group relative p-8 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-slate-700 hover:border-cyan-500/50 transition-all text-left overflow-hidden"
            >
                {/* Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/0 via-cyan-500/0 to-cyan-500/0 group-hover:from-cyan-500/10 group-hover:via-cyan-500/5 group-hover:to-transparent transition-all duration-500" />

                {/* Shine Effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
                </div>

                <div className="relative z-10">
                    <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-cyan-500/50 group-hover:scale-110 transition-transform">
                        <Upload className="text-white" size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">New Project Analysis</h3>
                    <p className="text-slate-400 leading-relaxed">
                        Upload your own CSV, Text, and JSON files to run a custom agentic loop.
                    </p>
                </div>
            </button>
        </div>
    );
}

function FileInput({ label, onChange }: { label: string, onChange: (f: File) => void }) {
    return (
        <div className="border border-slate-700 rounded-lg p-4 flex items-center justify-between hover:bg-slate-700/30 transition-colors bg-slate-900/50">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-700 rounded-lg flex items-center justify-center text-slate-400">
                    <FileText className="w-5 h-5" />
                </div>
                <span className="font-medium text-white">{label}</span>
            </div>
            <input
                type="file"
                className="text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-slate-700 file:text-white hover:file:bg-slate-600 file:transition-colors"
                onChange={(e) => e.target.files && onChange(e.target.files[0])}
            />
        </div>
    );
}
