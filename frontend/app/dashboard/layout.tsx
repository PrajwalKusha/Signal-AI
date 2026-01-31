import type { Metadata } from "next";
import Link from "next/link";
import {
    Search,
    Bell,
    ChevronDown
} from "lucide-react";
import { Sidebar } from "@/components/Sidebar";

export const metadata: Metadata = {
    title: "NexusFlow Dashboard | Signals",
    description: "Enterprise Intelligence Command Center",
};

export default function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="flex h-screen bg-white font-sans text-slate-900">
            {/* Sidebar Component with Client Logic */}
            <Sidebar />

            {/* Main Content Wrapper */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Top Bar - White */}
                <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6 lg:px-8 shadow-sm z-10">
                    {/* Left: Breadcrumbs / Title Context */}
                    <div className="flex items-center gap-4">
                        <div className="hidden md:flex items-center text-sm text-gray-400">
                            <span className="font-medium text-gray-900">Dashboard</span>
                            <span className="mx-2">/</span>
                            <span>Overview</span>
                        </div>
                    </div>

                    {/* Center: Search */}
                    <div className="flex-1 max-w-xl mx-8 hidden md:block">
                        <div className="relative group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#00897B] transition-colors" size={18} />
                            <input
                                type="text"
                                placeholder="Search projects, signals, or data..."
                                className="w-full bg-gray-50 border-none rounded-full py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-[#B2DFDB] focus:bg-white transition-all placeholder:text-gray-400 text-gray-900"
                            />
                        </div>
                    </div>

                    {/* Right: Actions & Profile */}
                    <div className="flex items-center gap-4">
                        <button className="relative p-2 text-gray-400 hover:text-[#00897B] hover:bg-teal-50 rounded-full transition-colors">
                            <Bell size={20} />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                        </button>

                        <div className="h-8 w-px bg-gray-200 mx-1"></div>

                        <div className="flex items-center gap-3 pl-1 cursor-pointer hover:bg-gray-50 p-1.5 rounded-lg transition-colors">
                            <div className="h-8 w-8 bg-teal-100 rounded-full flex items-center justify-center text-[#00796B] font-bold text-sm">
                                PK
                            </div>
                            <div className="hidden lg:block text-sm text-left">
                                <div className="font-semibold text-gray-900 leading-none">Prajwal K.</div>
                                <div className="text-xs text-gray-500 mt-0.5">Admin</div>
                            </div>
                            <ChevronDown size={14} className="text-gray-400 hidden lg:block" />
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-auto bg-white p-6 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
