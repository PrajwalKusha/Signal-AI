"use client";

import { motion } from "framer-motion";
import { User, Search, Brain, PenTool, Activity } from "lucide-react";

export function AgentNetwork() {
    const agents = [
        { name: "Analyst", icon: User, color: "text-blue-500", bg: "bg-blue-500/10", border: "border-blue-500/20" },
        { name: "Investigator", icon: Search, color: "text-purple-500", bg: "bg-purple-500/10", border: "border-purple-500/20" },
        { name: "Strategist", icon: Brain, color: "text-amber-500", bg: "bg-amber-500/10", border: "border-amber-500/20" },
        { name: "Ghostwriter", icon: PenTool, color: "text-rose-500", bg: "bg-rose-500/10", border: "border-rose-500/20" },
    ];

    return (
        <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm">
            <h3 className="text-slate-900 font-bold text-sm mb-4 flex items-center justify-between">
                <span>Swarm Status</span>
                <span className="flex items-center gap-1.5 px-2 py-0.5 bg-slate-50 text-slate-600 text-[10px] font-bold rounded-full border border-slate-200">
                    <Activity size={12} className="text-teal-500" />
                    Operational
                </span>
            </h3>

            <div className="grid grid-cols-2 gap-3">
                {agents.map((agent, i) => {
                    const Icon = agent.icon;
                    return (
                        <motion.div
                            key={agent.name}
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: i * 0.1 }}
                            className={`
                                relative flex flex-col items-center justify-center p-4 rounded-xl border ${agent.border} ${agent.bg} 
                                hover:scale-[1.02] transition-all cursor-default group
                            `}
                        >
                            {/* Status Dot */}
                            <div className="absolute top-3 right-3">
                                <span className={`flex h-2 w-2 rounded-full ${agent.color.replace('text', 'bg')} animate-pulse`} />
                            </div>

                            {/* Icon */}
                            <div className={`p-2.5 rounded-full bg-white shadow-sm mb-2 ${agent.color} group-hover:shadow-md transition-shadow`}>
                                <Icon size={18} />
                            </div>

                            {/* Name */}
                            <span className="text-xs font-bold text-slate-700 tracking-tight">
                                {agent.name}
                            </span>
                        </motion.div>
                    );
                })}
            </div>

            <button className="w-full mt-4 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 hover:text-teal-600 hover:bg-teal-50 rounded border border-transparent hover:border-teal-100 transition-all flex items-center justify-center gap-2">
                View Activity Logs
            </button>
        </div>
    );
}
