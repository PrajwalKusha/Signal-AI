"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Plus,
    Search,
    Filter,
    ArrowUpRight,
    ArrowDownRight,
    MoreHorizontal,
    Building2,
    Users,
    Zap,
    AlertCircle,
    CheckCircle2,
    TrendingUp,
    BarChart3,
    ChevronLeft,
    ChevronRight,
    ChevronDown,
    PieChart,
    Activity,
    ChevronUp,
    Clock
} from "lucide-react";

// Mock Data for Top Customers
const allCustomers = [
    {
        id: 1, name: "Acme Corp", industry: "Manufacturing", arr: "$2.4M", health: 98, status: "Healthy", trend: "up", signals: 12, logo: "AC",
        recentSignals: [
            { id: 101, title: "Expansion into APAC", date: "2h ago", type: "Growth" },
            { id: 102, title: "New CTO Appointed", date: "1d ago", type: "Leadership" },
            { id: 103, title: "Q4 Budget increased", date: "3d ago", type: "Budget" }
        ]
    },
    {
        id: 2, name: "Globex Inc", industry: "Logistics", arr: "$1.8M", health: 92, status: "Healthy", trend: "up", signals: 8, logo: "GL",
        recentSignals: [
            { id: 201, title: "Supply Chain Optimization", date: "5h ago", type: "Strategy" },
            { id: 202, title: "Partner Summit announced", date: "2d ago", type: "Event" }
        ]
    },
    {
        id: 3, name: "Soylent Corp", industry: "Food Tech", arr: "$1.5M", health: 45, status: "Critical", trend: "down", signals: 24, logo: "SC",
        recentSignals: [
            { id: 301, title: "Production halts", date: "30m ago", type: "Risk" },
            { id: 302, title: "Competitor merger", date: "1d ago", type: "Market" },
            { id: 303, title: "Stock price dip", date: "2d ago", type: "Financial" }
        ]
    },
    { id: 4, name: "Umbrella Corp", industry: "Pharma", arr: "$1.2M", health: 88, status: "Healthy", trend: "flat", signals: 5, logo: "UC", recentSignals: [] },
    { id: 5, name: "Stark Ind", industry: "Defense", arr: "$980k", health: 95, status: "Healthy", trend: "up", signals: 15, logo: "SI", recentSignals: [] },
    { id: 6, name: "Wayne Ent", industry: "Conglomerate", arr: "$850k", health: 72, status: "Watch", trend: "down", signals: 3, logo: "WE", recentSignals: [] },
    { id: 7, name: "Cyberdyne", industry: "AI/Robotics", arr: "$750k", health: 60, status: "Watch", trend: "flat", signals: 9, logo: "CY", recentSignals: [] },
    { id: 8, name: "Massive Dynamic", industry: "Technology", arr: "$620k", health: 91, status: "Healthy", trend: "up", signals: 7, logo: "MD", recentSignals: [] },
    { id: 9, name: "Initech", industry: "Software", arr: "$450k", health: 85, status: "Healthy", trend: "flat", signals: 2, logo: "IN", recentSignals: [] },
    { id: 10, name: "Hooli", industry: "Internet", arr: "$300k", health: 55, status: "Watch", trend: "down", signals: 18, logo: "HO", recentSignals: [] },
    { id: 11, name: "Vehement Capital", industry: "Finance", arr: "$280k", health: 99, status: "Healthy", trend: "up", signals: 4, logo: "VC", recentSignals: [] },
];

export default function CustomersPage() {
    // Pagination & Filter State
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const itemsPerPage = 5;

    // Filter Logic
    const filteredCustomers = useMemo(() => {
        return allCustomers.filter(customer => {
            const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                customer.industry.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = statusFilter === "All" || customer.status === statusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [searchTerm, statusFilter]);

    // Pagination Logic
    const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
    const currentCustomers = filteredCustomers.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-1">
                        Account Intelligence
                    </h1>
                    <p className="text-sm text-gray-500">
                        Monitoring your highest value milestones
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 bg-[#00897B] hover:bg-[#00796B] text-white px-5 py-2.5 rounded-lg text-sm font-bold shadow-md shadow-teal-900/10 transition-all hover:scale-105">
                        <Plus size={18} />
                        <span>Add Customer</span>
                    </button>
                </div>
            </div>

            {/* Stats Overview - Compact Redesign */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    label="Total ARR"
                    value="$10.8M"
                    trend="+12%"
                    trendUp={true}
                    icon={BarChart3}
                    color="text-emerald-600"
                    bgColor="bg-emerald-50"
                />
                <StatCard
                    label="Avg Health"
                    value="78%"
                    trend="-2%"
                    trendUp={false}
                    icon={Zap}
                    color="text-blue-600"
                    bgColor="bg-blue-50"
                />
                <StatCard
                    label="Signals"
                    value="124"
                    trend="+5"
                    trendUp={true}
                    icon={TrendingUp}
                    color="text-[#00897B]"
                    bgColor="bg-teal-50"
                />
                <StatCard
                    label="Churn Risk"
                    value="3"
                    trend="Critical"
                    trendUp={false}
                    icon={AlertCircle}
                    color="text-red-600"
                    bgColor="bg-red-50"
                />
            </div>

            {/* NEW: Market Insights Section (Health Donut & Industry Bars) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Health Distribution Widget */}
                <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-gray-900 flex items-center gap-2">
                            <PieChart className="w-4 h-4 text-gray-400" />
                            Portfolio Health
                        </h3>
                        <span className="text-xs text-gray-400 font-medium">Real-time</span>
                    </div>
                    <div className="flex items-center gap-8 justify-center">
                        {/* CSS Donut Chart */}
                        <div className="relative w-28 h-28 rounded-full"
                            style={{ background: 'conic-gradient(#10B981 0% 65%, #F59E0B 65% 85%, #EF4444 85% 100%)' }}>
                            <div className="absolute inset-4 bg-white rounded-full flex items-center justify-center flex-col">
                                <span className="text-2xl font-bold text-gray-900">92%</span>
                                <span className="text-[10px] text-gray-400 uppercase font-bold">Retention</span>
                            </div>
                        </div>
                        {/* Legend */}
                        <div className="space-y-2 text-xs">
                            <div className="flex items-center gap-2">
                                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
                                <span className="text-gray-600 font-medium">Healthy (65%)</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2.5 h-2.5 rounded-full bg-amber-500"></div>
                                <span className="text-gray-600 font-medium">Watch (20%)</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                                <span className="text-gray-600 font-medium">Critical (15%)</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Revenue Concentration Widget */}
                <div className="lg:col-span-2 bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-bold text-gray-900 flex items-center gap-2">
                            <Activity className="w-4 h-4 text-gray-400" />
                            Revenue Concentration
                        </h3>
                        <button className="text-xs text-[#00897B] font-bold hover:underline">View Details</button>
                    </div>
                    <div className="space-y-4">
                        {['Manufacturing', 'Logistics', 'Pharma'].map((industry, i) => (
                            <div key={industry}>
                                <div className="flex items-center justify-between text-xs mb-1.5">
                                    <span className="font-bold text-gray-700">{industry}</span>
                                    <span className="text-gray-500 font-medium">${(2.4 - (i * 0.6)).toFixed(1)}M</span>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-2">
                                    <div
                                        className="bg-[#00897B] h-2 rounded-full"
                                        style={{ width: `${80 - (i * 20)}%` }} // Mock widths
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Top 10 List with Expandable Rows */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100/50 overflow-hidden flex flex-col">
                {/* Table Header / Toolbar */}
                <div className="p-4 border-b border-gray-100/50 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                            <Building2 className="w-5 h-5 text-[#00897B]" />
                            Leaderboard
                        </h2>
                        <span className="text-xs font-medium bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                            {filteredCustomers.length}
                        </span>
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        {/* Filters */}
                        <div className="relative">
                            <button
                                onClick={() => setIsFilterOpen(!isFilterOpen)}
                                className={`flex items-center gap-2 border px-3 py-2 rounded-lg text-xs font-bold transition-colors ${statusFilter !== 'All' ? 'bg-teal-50 text-teal-700 border-teal-200' : 'bg-white border-gray-100/50 hover:bg-gray-50 text-gray-600'}`}
                            >
                                <Filter size={14} />
                                <span>{statusFilter === 'All' ? 'Filter status' : statusFilter}</span>
                                <ChevronDown size={12} className={`transition-transformDuration-200 ${isFilterOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {isFilterOpen && (
                                <>
                                    <div className="fixed inset-0 z-10" onClick={() => setIsFilterOpen(false)} />
                                    <motion.div
                                        initial={{ opacity: 0, y: 5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="absolute right-0 mt-2 w-40 bg-white rounded-xl shadow-xl border border-gray-100 z-20 overflow-hidden py-1"
                                    >
                                        {['All', 'Healthy', 'Watch', 'Critical'].map((status) => (
                                            <button
                                                key={status}
                                                onClick={() => {
                                                    setStatusFilter(status);
                                                    setIsFilterOpen(false);
                                                    setCurrentPage(1); // Reset page on filter
                                                }}
                                                className={`w-full text-left px-4 py-2 text-xs font-medium hover:bg-gray-50 flex items-center justify-between ${statusFilter === status ? 'text-[#00897B] bg-teal-50/50' : 'text-gray-600'}`}
                                            >
                                                {status}
                                                {statusFilter === status && <CheckCircle2 size={12} />}
                                            </button>
                                        ))}
                                    </motion.div>
                                </>
                            )}
                        </div>

                        {/* Search */}
                        <div className="relative flex-1 sm:flex-none">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
                            <input
                                type="text"
                                placeholder="Search..."
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                    setCurrentPage(1); // Reset page on search
                                }}
                                className="pl-9 pr-4 py-2 bg-gray-50 border-none rounded-lg text-xs font-medium focus:ring-1 focus:ring-teal-200 w-full sm:w-56 transition-all placeholder:text-gray-400"
                            />
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50/50 text-xs text-gray-500 uppercase font-medium">
                            <tr>
                                <th className="px-6 py-3 text-left w-10"></th>
                                <th className="px-6 py-3 text-left w-64">Company</th>
                                <th className="px-6 py-3 text-left w-48">Health Score</th>
                                <th className="px-6 py-3 text-left">ARR</th>
                                <th className="px-6 py-3 text-left">Active Signals</th>
                                <th className="px-6 py-3 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            <AnimatePresence mode="wait">
                                {currentCustomers.map((customer, index) => (
                                    <CustomerRow key={customer.id} customer={customer} index={index} />
                                ))}
                            </AnimatePresence>
                            {currentCustomers.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="text-center py-10 text-gray-500 text-sm">
                                        No customers found matching your criteria.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Footer */}
                {totalPages > 1 && (
                    <div className="p-4 border-t border-gray-100 flex items-center justify-between">
                        <div className="text-xs text-gray-500">
                            Showing <span className="font-bold">{((currentPage - 1) * itemsPerPage) + 1}</span> to <span className="font-bold">{Math.min(currentPage * itemsPerPage, filteredCustomers.length)}</span> of <span className="font-bold">{filteredCustomers.length}</span> entries
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="p-2 rounded-lg hover:bg-gray-50 text-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <ChevronLeft size={16} />
                            </button>
                            <div className="flex items-center gap-1">
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                    <button
                                        key={page}
                                        onClick={() => handlePageChange(page)}
                                        className={`w-8 h-8 rounded-lg text-xs font-bold transition-colors ${currentPage === page
                                                ? "bg-[#00897B] text-white shadow-sm"
                                                : "text-gray-600 hover:bg-gray-50"
                                            }`}
                                    >
                                        {page}
                                    </button>
                                ))}
                            </div>
                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="p-2 rounded-lg hover:bg-gray-50 text-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

function StatCard({ label, value, trend, trendUp, icon: Icon, color, bgColor }: any) {
    return (
        <div className="bg-white px-5 py-4 rounded-xl border border-gray-100 shadow-sm transition-all hover:border-gray-200 flex items-center justify-between">
            <div>
                <div className="text-sm text-gray-500 font-medium mb-0.5">{label}</div>
                <div className="text-xl font-bold text-gray-900">{value}</div>
            </div>
            <div className="flex flex-col items-end gap-2">
                <div className={`p-2 rounded-lg ${bgColor} ${color}`}>
                    <Icon size={18} />
                </div>
                <div className={`flex items-center gap-0.5 text-[10px] font-bold ${trendUp ? "text-emerald-600" : "text-red-600"} bg-gray-50 px-1.5 py-0.5 rounded-full border border-gray-100/50`}>
                    {trendUp ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
                    {trend}
                </div>
            </div>
        </div>
    );
}

function CustomerRow({ customer, index }: { customer: any, index: number }) {
    const [expanded, setExpanded] = useState(false);

    return (
        <>
            <motion.tr
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className={`group transition-colors cursor-pointer ${expanded ? 'bg-gray-50 border-b-0' : 'hover:bg-gray-50/50 border-gray-50'}`}
                onClick={() => setExpanded(!expanded)}
            >
                <td className="px-6 py-3.5">
                    <button className="text-gray-400 hover:text-[#00897B] transition-colors">
                        {expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                    </button>
                </td>
                <td className="px-6 py-3.5">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-500 group-hover:bg-white transition-colors">
                            {customer.logo}
                        </div>
                        <div>
                            <div className="font-bold text-gray-900 text-sm flex items-center gap-2">
                                {customer.name}
                                {customer.id <= 3 && <span className="text-[9px] bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded border border-amber-100">TOP {customer.id}</span>}
                            </div>
                            <div className="text-[10px] text-gray-400 font-medium">{customer.industry}</div>
                        </div>
                    </div>
                </td>
                <td className="px-6 py-3.5">
                    <div className="flex items-center gap-3">
                        <div className="flex-1 w-20 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div
                                className={`h-full rounded-full ${customer.health > 90 ? "bg-emerald-500" :
                                        customer.health > 70 ? "bg-blue-500" :
                                            customer.health > 50 ? "bg-amber-500" : "bg-red-500"
                                    }`}
                                style={{ width: `${customer.health}%` }}
                            />
                        </div>
                        <span className={`text-xs font-bold ${customer.health > 90 ? "text-emerald-700" :
                                customer.health > 70 ? "text-blue-700" :
                                    customer.health > 50 ? "text-amber-700" : "text-red-700"
                            }`}>{customer.health}%</span>
                    </div>
                </td>
                <td className="px-6 py-3.5">
                    <div className="font-bold text-gray-900 text-sm">{customer.arr}</div>
                </td>
                <td className="px-6 py-3.5">
                    <div className="flex items-center gap-2">
                        <div className="bg-teal-50 text-[#00897B] px-2 py-0.5 rounded text-[10px] font-bold border border-teal-100/50">
                            {customer.signals} Signals
                        </div>
                    </div>
                </td>
                <td className="px-6 py-3.5 text-right">
                    <button className="text-gray-300 hover:text-[#00897B] p-1.5 rounded-full hover:bg-teal-50 transition-colors">
                        <MoreHorizontal size={16} />
                    </button>
                </td>
            </motion.tr>

            {/* Expanded Row Content */}
            <AnimatePresence>
                {expanded && (
                    <motion.tr
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                    >
                        <td colSpan={6} className="bg-gray-50/50 p-0 border-b border-gray-100">
                            <div className="px-6 py-4 pl-20">
                                <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">Recent Signals</h4>
                                {customer.recentSignals && customer.recentSignals.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                        {customer.recentSignals.map((signal: any) => (
                                            <div key={signal.id} className="bg-white border border-gray-100 p-3 rounded-lg shadow-sm">
                                                <div className="flex items-center justify-between mb-1">
                                                    <span className="text-[10px] font-bold text-[#00897B] bg-teal-50 px-1.5 py-0.5 rounded">
                                                        {signal.type}
                                                    </span>
                                                    <div className="flex items-center gap-1 text-[10px] text-gray-400">
                                                        <Clock size={10} />
                                                        {signal.date}
                                                    </div>
                                                </div>
                                                <div className="text-xs font-bold text-gray-800 line-clamp-1">{signal.title}</div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-xs text-gray-400 italic">No recent signals recorded.</div>
                                )}
                            </div>
                        </td>
                    </motion.tr>
                )}
            </AnimatePresence>
        </>
    );
}
