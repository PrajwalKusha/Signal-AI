"use client";

import React from "react";
import Link from "next/link";
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
        <aside className="w-16 lg:w-64 bg-[#00897B] flex flex-col transition-all duration-300 shadow-xl z-20">
            <div className="h-16 flex items-center px-4 lg:px-6 bg-[#00796B]">
                <Link href="/" className="flex items-center gap-3 group w-full">
                    {/* Logo Icon */}
                    <div className="h-8 w-8 bg-white/20 rounded-lg flex items-center justify-center text-white backdrop-blur-sm shadow-sm group-hover:bg-white/30 transition-colors">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="w-5 h-5"
                        >
                            <path d="M12 2v20M2 12h20" />
                        </svg>
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
                <SidebarItem
                    icon={<FileText size={20} />}
                    label="Documents"
                    href="/dashboard/knowledge"
                    active={pathname === "/dashboard/knowledge"}
                />
            </nav>

            <div className="p-3 mt-auto border-t border-white/10">
                <SidebarItem
                    icon={<Settings size={20} />}
                    label="Settings"
                    href="/dashboard/settings"
                    active={pathname === "/dashboard/settings"}
                />
                <button className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-white/70 hover:bg-white/10 hover:text-white transition-all text-sm font-bold mt-1">
                    <LogOut size={20} />
                    <span className="hidden lg:block">Sign Out</span>
                </button>
            </div>
        </aside>
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
