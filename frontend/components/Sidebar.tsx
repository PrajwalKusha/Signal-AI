"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Users,
    UserCircle,
    Settings,
    LogOut,
    FileText,
    Database
} from "lucide-react";

export function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="w-16 lg:w-64 bg-slate-900 flex flex-col transition-all duration-300 shadow-xl z-20">
            <div className="h-16 flex items-center px-4 lg:px-6 bg-slate-900 border-b border-slate-800">
                <Link
                    href="/"
                    className="flex items-center gap-3 group w-full"
                    onClick={() => {
                        // Clear session storage when navigating to landing page
                        sessionStorage.removeItem('hasScanned');
                        sessionStorage.removeItem('visibleSignalsCount');
                        sessionStorage.removeItem('allSignals');
                    }}
                >
                    {/* Logo Icon */}
                    <div className="h-9 w-9 bg-white/10 rounded-lg flex items-center justify-center backdrop-blur-sm shadow-sm group-hover:bg-white/20 transition-all p-1.5">
                        <Image
                            src="/signal.svg"
                            alt="Signals Logo"
                            width={32}
                            height={32}
                            className="w-full h-full drop-shadow-sm"
                        />
                    </div>
                    <span className="font-bold text-xl tracking-tight text-white hidden lg:block opacity-100 transition-opacity">Signals</span>
                </Link>
            </div>


            <nav className="flex-1 py-6 space-y-1 px-3">
                <SidebarItem
                    icon={<LayoutDashboard size={20} />}
                    label="Dashboard"
                    href="/dashboard"
                    active={pathname === "/dashboard"}
                />
                <SidebarItem
                    icon={<Database size={20} />}
                    label="Data Sources"
                    href="/dashboard/data"
                    active={pathname === "/dashboard/data"}
                />
                <SidebarItem
                    icon={<Users size={20} />}
                    label="Customers"
                    href="/dashboard/customers"
                    active={pathname === "/dashboard/customers"}
                />
                <SidebarItem
                    icon={<UserCircle size={20} />}
                    label="Team"
                    href="/dashboard/team"
                    active={pathname === "/dashboard/team"}
                />
            </nav>

            <div className="p-3 mt-auto border-t border-slate-800">
                <SidebarItem
                    icon={<Settings size={20} />}
                    label="Settings"
                    href="/dashboard/settings"
                    active={pathname === "/dashboard/settings"}
                />
                <button
                    className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-white/70 hover:bg-white/10 hover:text-white transition-all text-sm font-bold mt-1"
                    onClick={() => {
                        // Clear session storage on logout
                        sessionStorage.removeItem('hasScanned');
                        sessionStorage.removeItem('visibleSignalsCount');
                        sessionStorage.removeItem('allSignals');
                        sessionStorage.removeItem('signals');
                        // Navigate to login
                        window.location.href = '/';
                    }}
                >
                    <LogOut size={20} />
                    <span className="hidden lg:block">Sign Out</span>
                </button>
            </div>
        </aside >
    );
}

function SidebarItem({ icon, label, href, active = false }: { icon: any, label: string, href: string, active?: boolean }) {
    return (
        <Link
            href={href}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-bold transition-all group my-0.5 ${active
                ? "bg-white/20 text-white shadow-sm"
                : "text-white/80 hover:bg-white/10 hover:text-white"
                }`}
        >
            <span className={`${active ? "text-white" : "text-white/80 group-hover:text-white"} transition-colors`}>
                {icon}
            </span>
            <span className="hidden lg:block">{label}</span>
        </Link>
    )
}
