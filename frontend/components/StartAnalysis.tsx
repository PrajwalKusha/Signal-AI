"use client";

import { useState } from "react";
import { Upload, FileText, Play, Loader2 } from "lucide-react";
import { clsx } from "clsx";

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
            // 1. Upload
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

            // 2. Audit
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
                <Loader2 className="w-12 h-12 text-slate-400 animate-spin mb-4" />
                <h2 className="text-xl font-semibold text-slate-800">Running Agentic Workflow...</h2>
                <p className="text-slate-500 mt-2">Analying Sales CSV • Scanning Context • Matching Backlog</p>
            </div>
        );
    }

    if (mode === "upload") {
        return (
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
                <h2 className="text-2xl font-bold mb-6">Upload Project Files</h2>

                <div className="space-y-4 mb-8">
                    <FileInput label="Sales Data (CSV)" onChange={(f) => setFiles({ ...files, sales: f })} />
                    <FileInput label="Context Log (TXT)" onChange={(f) => setFiles({ ...files, context: f })} />
                    <FileInput label="Transformation Backlog (JSON)" onChange={(f) => setFiles({ ...files, backlog: f })} />
                </div>

                <div className="flex gap-4">
                    <button onClick={() => setMode("select")} className="px-6 py-3 text-slate-600 font-medium hover:bg-slate-50 rounded-lg">
                        Back
                    </button>
                    <button
                        onClick={handleCustom}
                        disabled={!files.sales || !files.context || !files.backlog}
                        className="flex-1 bg-slate-900 text-white px-6 py-3 rounded-lg font-bold hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        <Play className="w-4 h-4" /> Run Analysis
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="grid md:grid-cols-2 gap-6">
            <button
                onClick={handleDemo}
                className="group p-8 bg-white rounded-2xl shadow-sm border border-slate-200 hover:border-emerald-500 hover:ring-1 hover:ring-emerald-500 transition-all text-left"
            >
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Play className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Run Demo Audit</h3>
                <p className="text-slate-500">
                    Use the pre-loaded "Red Thread" dataset (Sales Drop, Context Log, Backlog) to see the agent in action.
                </p>
            </button>

            <button
                onClick={() => setMode("upload")}
                className="group p-8 bg-white rounded-2xl shadow-sm border border-slate-200 hover:border-blue-500 hover:ring-1 hover:ring-blue-500 transition-all text-left"
            >
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Upload className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">New Project Analysis</h3>
                <p className="text-slate-500">
                    Upload your own CSV, Text, and JSON files to run a custom agentic loop.
                </p>
            </button>
        </div>
    );
}

function FileInput({ label, onChange }: { label: string, onChange: (f: File) => void }) {
    return (
        <div className="border border-slate-200 rounded-lg p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-500">
                    <FileText className="w-5 h-5" />
                </div>
                <span className="font-medium text-slate-700">{label}</span>
            </div>
            <input
                type="file"
                className="text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200"
                onChange={(e) => e.target.files && onChange(e.target.files[0])}
            />
        </div>
    );
}
