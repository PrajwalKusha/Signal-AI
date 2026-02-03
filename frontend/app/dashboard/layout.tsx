import type { Metadata } from "next";
import Link from "next/link";
import {
    Search,
    Bell,
    ChevronDown
} from "lucide-react";
import { Sidebar } from "@/components/Sidebar";
import { DashboardHeader } from "@/components/DashboardHeader";

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
                {/* Top Bar - Managed by Client Component */}
                <DashboardHeader />

                {/* Page Content */}
                <main className="flex-1 overflow-auto bg-white p-6 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
