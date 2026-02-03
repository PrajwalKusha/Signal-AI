"use client";

import { motion } from "framer-motion";
import { Activity, ShieldCheck, Database, Server, Cpu } from "lucide-react";
import { useEffect, useState } from "react";

export function SystemHealthCode() {
    const [codeLines, setCodeLines] = useState<string[]>([]);

    // Matrix-style code rain effect generator
    useEffect(() => {
        const commands = [
            "Initializing neural swarm...",
            "Checking node status... OK",
            "Verifying integrity hash...",
            "Latency: 12ms",
            "Swarm coherence: 99.8%",
            "Memory buffer: Optimized",
            "Threat detection: Active",
            "Syncing with master node...",
            "Allocating resources...",
            "Encrypting data stream..."
        ];

        const interval = setInterval(() => {
            setCodeLines(prev => {
                const newLine = commands[Math.floor(Math.random() * commands.length)];
                const newLines = [...prev, `> ${newLine}`];
                if (newLines.length > 8) return newLines.slice(1);
                return newLines;
            });
        }, 800);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm overflow-hidden relative">
            {/* Header */}
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-2">
                <h3 className="text-slate-600 font-mono text-xs uppercase tracking-wider flex items-center gap-2">
                    <Activity size={14} className="text-teal-600" /> System Status
                </h3>
                <span className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-teal-50 text-teal-700 text-[10px] font-bold border border-teal-100">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse"></span>
                    ONLINE
                </span>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 gap-3 mb-4">
                <MetricItem icon={ShieldCheck} label="Security" value="100%" color="text-emerald-600" bg="bg-emerald-50" />
                <MetricItem icon={Database} label="Storage" value="48%" color="text-blue-600" bg="bg-blue-50" />
                <MetricItem icon={Server} label="Uptime" value="99.99%" color="text-amber-600" bg="bg-amber-50" />
                <MetricItem icon={Cpu} label="Load" value="12%" color="text-purple-600" bg="bg-purple-50" />
            </div>

            {/* Terminal View (Light) */}
            <div className="font-mono text-[10px] text-slate-500 space-y-1 h-32 overflow-hidden relative bg-slate-50 rounded-lg p-3 border border-slate-100">
                <div className="absolute inset-0 bg-gradient-to-t from-slate-50 via-transparent to-transparent z-10"></div>
                {codeLines.map((line, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -5 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="truncate"
                    >
                        <span className="text-slate-400 mr-2">{new Date().toLocaleTimeString().split(' ')[0]}</span>
                        <span className="text-slate-600">{line}</span>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}

function MetricItem({ icon: Icon, label, value, color, bg }: { icon: any, label: string, value: string, color: string, bg: string }) {
    return (
        <div className="bg-slate-50 rounded-lg p-2.5 flex items-center gap-3 border border-slate-100">
            <div className={`p-1.5 rounded ${bg} ${color}`}>
                <Icon size={14} />
            </div>
            <div>
                <div className="text-[10px] text-slate-400 uppercase font-medium">{label}</div>
                <div className={`text-sm font-mono font-bold ${color}`}>{value}</div>
            </div>
        </div>
    );
}
