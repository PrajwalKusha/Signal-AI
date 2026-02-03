"use client";

import React, { useState, useEffect } from "react";
import { Search, PlayCircle, ChevronDown } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import { OnboardingTour } from "@/components/OnboardingTour";

export function DashboardHeader() {
    const [showTour, setShowTour] = useState(false);

    useEffect(() => {
        // Check if user has seen the tour
        const hasSeenTour = sessionStorage.getItem('hasSeenTour');
        if (!hasSeenTour) {
            setShowTour(true);
        }
    }, []);

    const handleTourClose = () => {
        setShowTour(false);
        sessionStorage.setItem('hasSeenTour', 'true');
    };

    return (
        <>
            <AnimatePresence>
                {showTour && (
                    <OnboardingTour onClose={handleTourClose} />
                )}
            </AnimatePresence>

            <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6 lg:px-8 shadow-sm z-10 transition-colors duration-300">
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
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-teal-600 transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="Search projects, signals, or data..."
                            className="w-full bg-gray-50 border-none rounded-full py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-teal-100 focus:bg-white transition-all placeholder:text-gray-400 text-gray-900"
                        />
                    </div>
                </div>

                {/* Right: Actions & Profile */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setShowTour(true)}
                        className="relative p-2 text-gray-400 hover:text-teal-600 hover:bg-gray-50 rounded-full transition-colors tooltip group"
                        title="Replay Onboarding Tour"
                    >
                        <PlayCircle size={20} />
                    </button>

                    <div className="h-8 w-px bg-gray-200 mx-1"></div>

                    <div className="flex items-center gap-3 pl-1 cursor-pointer hover:bg-gray-50 p-1.5 rounded-lg transition-colors">
                        {/* Profile Picture */}
                        <div className="relative h-10 w-10 rounded-full overflow-hidden border-2 border-gray-100 shadow-sm">
                            <img
                                src="/young-man.png"
                                alt="Admin Profile"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="hidden lg:block text-sm text-left">
                            <div className="font-semibold text-gray-900 leading-none">Prajwal K.</div>
                            <div className="text-xs text-gray-500 mt-0.5">Admin</div>
                        </div>
                        <ChevronDown size={14} className="text-gray-400 hidden lg:block" />
                    </div>
                </div>
            </header>
        </>
    );
}
