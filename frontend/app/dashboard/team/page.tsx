"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Plus,
    Search,
    Filter,
    MoreHorizontal,
    Users,
    Shield,
    Mail,
    UserPlus,
    CheckCircle2,
    Clock,
    Trash2,
    Edit2,
    Crown,
    DollarSign,
    Briefcase,
    Trophy,
    Timer,
    TrendingUp,
    BarChart3
} from "lucide-react";

// Mock Data from data/team_view.json
const initialMembers = [
    { id: 1, name: "Aria Montgomery", email: "aria@signals.ai", role: "Admin", status: "Active", lastActive: "Just now", avatar: "AM", total_revenue: 29902415.0, deals_closed: 164, avg_deal_size: 182332.0, avg_cycle_days: 54.0, win_rate: 1.0 },
    { id: 2, name: "Chloe Dubois", email: "chloe@signals.ai", role: "Editor", status: "Active", lastActive: "2h ago", avatar: "CD", total_revenue: 32662588.0, deals_closed: 174, avg_deal_size: 187716.0, avg_cycle_days: 57.0, win_rate: 0.98 },
    { id: 3, name: "Hiroshi Tanaka", email: "hiroshi@signals.ai", role: "Editor", status: "Active", lastActive: "5h ago", avatar: "HT", total_revenue: 29670670.0, deals_closed: 165, avg_deal_size: 179822.0, avg_cycle_days: 54.0, win_rate: 0.95 },
    { id: 4, name: "Lukas Weber", email: "lukas@signals.ai", role: "Viewer", status: "Active", lastActive: "1d ago", avatar: "LW", total_revenue: 27861914.0, deals_closed: 154, avg_deal_size: 180922.0, avg_cycle_days: 54.0, win_rate: 0.92 },
    { id: 5, name: "Marcus Thorne", email: "marcus@signals.ai", role: "Admin", status: "Active", lastActive: "30m ago", avatar: "MT", total_revenue: 31207649.0, deals_closed: 183, avg_deal_size: 170534.0, avg_cycle_days: 55.0, win_rate: 0.88 },
    { id: 6, name: "Sarah Chen", email: "sarah.c@signals.ai", role: "Editor", status: "Active", lastActive: "10m ago", avatar: "SC", total_revenue: 32775092.0, deals_closed: 160, avg_deal_size: 204844.0, avg_cycle_days: 51.0, win_rate: 0.99 },
];

export default function TeamPage() {
    const [members, setMembers] = useState(initialMembers);
    const [searchTerm, setSearchTerm] = useState("");
    const [roleFilter, setRoleFilter] = useState("All");

    // Filter Logic
    const filteredMembers = useMemo(() => {
        return members.filter(member => {
            const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                member.email.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesRole = roleFilter === "All" || member.role === roleFilter;
            return matchesSearch && matchesRole;
        });
    }, [members, searchTerm, roleFilter]);

    // Aggregate Stats
    const totalRevenue = members.reduce((acc, curr) => acc + curr.total_revenue, 0);
    const totalDeals = members.reduce((acc, curr) => acc + curr.deals_closed, 0);
    const avgWinRate = members.reduce((acc, curr) => acc + curr.win_rate, 0) / members.length;
    const avgCycle = members.reduce((acc, curr) => acc + curr.avg_cycle_days, 0) / members.length;

    // Format Helpers
    const formatMoney = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 1,
            notation: "compact"
        }).format(amount);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-1">
                        Team Performance
                    </h1>
                    <p className="text-sm text-gray-500">
                        Sales leaderboard and rep efficiency metrics
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 bg-[#00897B] hover:bg-[#00796B] text-white px-5 py-2.5 rounded-lg text-sm font-bold shadow-md shadow-teal-900/10 transition-all hover:scale-105">
                        <UserPlus size={18} />
                        <span>Invite Rep</span>
                    </button>
                </div>
            </div>

            {/* Stats Overview - Sales Focused */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    label="Team Revenue"
                    value={formatMoney(totalRevenue)}
                    subtext="FY 2024"
                    icon={DollarSign}
                    color="text-emerald-600"
                    bgColor="bg-emerald-50"
                />
                <StatCard
                    label="Deals Closed"
                    value={totalDeals.toString()}
                    subtext="Total Volume"
                    icon={Briefcase}
                    color="text-blue-600"
                    bgColor="bg-blue-50"
                />
                <StatCard
                    label="Avg Win Rate"
                    value={`${(avgWinRate * 100).toFixed(1)}%`}
                    subtext="Pipeline Health"
                    icon={Trophy}
                    color="text-amber-600"
                    bgColor="bg-amber-50"
                />
                <StatCard
                    label="Avg Cycle Time"
                    value={`${avgCycle.toFixed(0)} Days`}
                    subtext="Deal Velocity"
                    icon={Timer}
                    color="text-[#00897B]"
                    bgColor="bg-teal-50"
                />
            </div>

            {/* Team Directory Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100/50 overflow-hidden flex flex-col h-full">
                {/* Toolbar */}
                <div className="p-4 border-b border-gray-100/50 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                            <BarChart3 className="w-5 h-5 text-[#00897B]" />
                            Leaderboard
                        </h2>
                        <span className="text-xs font-medium bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                            {filteredMembers.length} Reps
                        </span>
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        {/* Role Filter */}
                        <div className="flex items-center gap-2 bg-gray-50 p-1 rounded-lg border border-gray-100/50">
                            {['All', 'Admin', 'Editor', 'Viewer'].map((role) => (
                                <button
                                    key={role}
                                    onClick={() => setRoleFilter(role)}
                                    className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${roleFilter === role
                                            ? "bg-white text-[#00897B] shadow-sm"
                                            : "text-gray-500 hover:text-gray-700"
                                        }`}
                                >
                                    {role}
                                </button>
                            ))}
                        </div>

                        {/* Search */}
                        <div className="relative flex-1 sm:flex-none">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
                            <input
                                type="text"
                                placeholder="Search reps..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-9 pr-4 py-2 bg-gray-50 border-none rounded-lg text-xs font-medium focus:ring-1 focus:ring-teal-200 w-full sm:w-56 transition-all placeholder:text-gray-400"
                            />
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50/50 text-xs text-gray-500 uppercase font-medium">
                            <tr>
                                <th className="px-6 py-3 text-left w-56">Rep</th>
                                <th className="px-6 py-3 text-left w-32">Total Revenue</th>
                                <th className="px-6 py-3 text-left w-40">Win Rate</th>
                                <th className="px-6 py-3 text-left w-24">Deals</th>
                                <th className="px-6 py-3 text-left">Avg Deal Size</th>
                                <th className="px-6 py-3 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            <AnimatePresence mode="wait">
                                {filteredMembers
                                    .sort((a, b) => b.total_revenue - a.total_revenue) // Sort by Revenue by default
                                    .map((member, index) => (
                                        <MemberRow key={member.id} member={member} index={index} formatMoney={formatMoney} />
                                    ))}
                            </AnimatePresence>
                            {filteredMembers.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="text-center py-10 text-gray-500 text-sm">
                                        No members found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

function StatCard({ label, value, subtext, icon: Icon, color, bgColor }: any) {
    return (
        <div className="bg-white px-5 py-4 rounded-xl border border-gray-100 shadow-sm transition-all hover:border-gray-200 flex items-center justify-between">
            <div>
                <div className="text-sm text-gray-500 font-medium mb-0.5">{label}</div>
                <div className="text-2xl font-bold text-gray-900">{value}</div>
                <div className="text-[10px] text-gray-400 font-medium mt-1">{subtext}</div>
            </div>
            <div className={`p-3 rounded-lg ${bgColor} ${color}`}>
                <Icon size={20} />
            </div>
        </div>
    );
}

function MemberRow({ member, index, formatMoney }: { member: any, index: number, formatMoney: (n: number) => string }) {
    const revenueColor = index === 0 ? "text-emerald-700" : "text-gray-900";

    return (
        <motion.tr
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="group hover:bg-gray-50/50 transition-colors"
        >
            <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 border border-gray-100 flex items-center justify-center text-xs font-bold text-gray-600 relative">
                        {member.avatar}
                        {index < 3 && (
                            <div className="absolute -top-1 -right-1 bg-amber-400 border border-white text-white rounded-full p-0.5 w-4 h-4 flex items-center justify-center text-[8px] font-bold">
                                {index + 1}
                            </div>
                        )}
                    </div>
                    <div>
                        <div className="font-bold text-gray-900 text-sm flex items-center gap-2">
                            {member.name}
                            {member.role === 'Admin' && <Crown size={12} className="text-indigo-500 fill-indigo-100" />}
                        </div>
                        <div className="text-xs text-gray-500">{member.email}</div>
                    </div>
                </div>
            </td>
            <td className="px-6 py-4">
                <span className={`text-sm font-bold ${revenueColor}`}>
                    {formatMoney(member.total_revenue)}
                </span>
            </td>
            <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                    <div className="flex-1 w-20 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                            className={`h-full rounded-full ${member.win_rate >= 0.9 ? "bg-emerald-500" :
                                    member.win_rate >= 0.8 ? "bg-amber-500" : "bg-red-500"
                                }`}
                            style={{ width: `${member.win_rate * 100}%` }}
                        />
                    </div>
                    <span className="text-xs font-bold text-gray-600">{(member.win_rate * 100).toFixed(0)}%</span>
                </div>
            </td>
            <td className="px-6 py-4">
                <span className="text-sm font-bold text-gray-700">{member.deals_closed}</span>
            </td>
            <td className="px-6 py-4">
                <div className="flex items-center gap-1.5 text-xs text-gray-700 font-bold">
                    {formatMoney(member.avg_deal_size)}
                    <span className="text-gray-400 font-normal">/ prev</span>
                </div>
            </td>
            <td className="px-6 py-4 text-right">
                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-1.5 text-gray-400 hover:text-[#00897B] hover:bg-teal-50 rounded-lg transition-colors" title="View Details">
                        <TrendingUp size={14} />
                    </button>
                    <button className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Remove Member">
                        <Trash2 size={14} />
                    </button>
                </div>
            </td>
        </motion.tr>
    );
}
