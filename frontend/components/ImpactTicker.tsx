"use client";

import { motion } from "framer-motion";
import { DollarSign, TrendingUp, ArrowUpRight } from "lucide-react";

export function ImpactTicker() {
    return (
        <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                <TrendingUp size={80} className="text-teal-600" />
            </div>

            <div className="relative z-10">
                <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">
                    <DollarSign size={14} /> Total Opportunity
                </div>

                <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-4xl font-bold text-slate-900 tracking-tighter">
                        $14.2M
                    </span>
                    <span className="text-sm font-bold text-teal-600 flex items-center">
                        <ArrowUpRight size={14} /> +22%
                    </span>
                </div>

                <p className="text-xs text-slate-500 mt-3 leading-relaxed">
                    Cumulative potential revenue impact detected across all observed segments this quarter.
                </p>

                <div className="mt-4 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-teal-500 to-emerald-400 w-[75%] rounded-full animate-pulse"></div>
                </div>
            </div>
        </div>
    );
}
