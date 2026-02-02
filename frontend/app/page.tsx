"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Zap, Brain, TrendingUp, Lock, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function LandingPage() {
  const router = useRouter();
  const [showInput, setShowInput] = useState(false);
  const [accessCode, setAccessCode] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      if (accessCode === "1010") {
        router.push("/dashboard");
      } else {
        setError(true);
        setLoading(false);
      }
    }, 800);
  };

  return (
    <div className="h-screen w-full bg-[#f1f5f9] relative overflow-hidden flex flex-col font-sans text-slate-900 selection:bg-teal-100 selection:text-teal-900">

      {/* 1. Technical Background: Dot Pattern + Vignette */}
      <div
        className="absolute inset-0 z-0 opacity-[0.3]"
        style={{
          backgroundImage: 'radial-gradient(#94a3b8 1px, transparent 1px)',
          backgroundSize: '32px 32px'
        }}
      />
      {/* Soft gradient overlay to soften the grid */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-50/40 to-slate-200/80 pointer-events-none" />

      {/* Dynamic Orbs - adjusted for Grey background */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-teal-200/40 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 animate-pulse-slow mix-blend-multiply" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-200/40 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4 mix-blend-multiply" />

      {/* 2. Header */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 relative">
            <Image src="/signal.svg" alt="Signals" fill className="object-contain" />
          </div>
          <span className="font-bold text-xl tracking-tight text-slate-800">Signals</span>
        </div>
        <div className="px-3 py-1 bg-white/50 border border-slate-200 rounded-full text-xs font-medium text-slate-500 backdrop-blur-sm">
          v2.0.1
        </div>
      </nav>

      {/* 3. Main Content - Centered & Compact */}
      <main className="flex-1 relative z-10 flex flex-col items-center justify-center px-4 sm:px-6">

        {/* Hero Text */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-bold tracking-tight text-slate-900 mb-6"
          >
            Intelligence, <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-blue-600">
              Decoded.
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-slate-500 max-w-lg mx-auto leading-relaxed"
          >
            The enterprise command center for real-time strategic signals.
          </motion.p>
        </div>

        {/* Interaction Zone (Code Input) */}
        <div className="h-24 mb-12 flex justify-center items-center w-full">
          <AnimatePresence mode="wait">
            {!showInput ? (
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: 0.2 }}
                onClick={() => setShowInput(true)}
                className="group flex items-center gap-3 bg-slate-900 text-white pl-8 pr-6 py-4 rounded-full font-semibold shadow-2xl hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.3)] hover:scale-105 transition-all duration-300"
              >
                <span>Initialize System</span>
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-colors">
                  <ArrowRight size={16} />
                </div>
              </motion.button>
            ) : (
              <motion.form
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                onSubmit={handleUnlock}
                className="relative"
              >
                <div className={`flex items-center gap-2 bg-white/80 backdrop-blur-md p-2 rounded-2xl shadow-2xl border-2 transition-colors ${error ? 'border-red-100 ring-2 ring-red-50' : 'border-white ring-1 ring-slate-200'}`}>
                  <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-slate-50 text-slate-400">
                    <Lock size={20} />
                  </div>
                  <input
                    autoFocus
                    type="password"
                    placeholder="CODE"
                    className="bg-transparent border-none w-32 text-center text-2xl font-bold tracking-[0.2em] text-slate-800 placeholder:text-slate-300 focus:ring-0"
                    value={accessCode}
                    onChange={(e) => {
                      setAccessCode(e.target.value);
                      setError(false);
                    }}
                    maxLength={4}
                  />
                  <button
                    type="submit"
                    disabled={loading || accessCode.length < 4}
                    className={`h-12 px-6 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${loading ? 'bg-slate-100 text-slate-400' : 'bg-teal-600 text-white hover:bg-teal-700 shadow-md'
                      }`}
                  >
                    {loading ? '...' : <ArrowRight size={18} />}
                  </button>
                </div>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute -bottom-8 left-0 right-0 text-center text-xs font-semibold text-red-500 flex items-center justify-center gap-1"
                  >
                    <AlertCircle size={12} /> Invalid Access Code
                  </motion.div>
                )}
              </motion.form>
            )}
          </AnimatePresence>
        </div>

        {/* Features - Integrated Horizontal Grid */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-4xl px-4"
        >
          <FeatureCard
            icon={<Zap size={20} />}
            title="Real-Time Analysis"
            desc="Instant processing of market data streams"
            color="bg-amber-50 text-amber-600"
          />
          <FeatureCard
            icon={<Brain size={20} />}
            title="Agentic Reasoning"
            desc="Autonomous logic that verifies signals"
            color="bg-purple-50 text-purple-600"
          />
          <FeatureCard
            icon={<TrendingUp size={20} />}
            title="Strategic Impact"
            desc="Quantifiable USD ROI calculation"
            color="bg-teal-50 text-teal-600"
          />
        </motion.div>

      </main>



    </div>
  );
}

function FeatureCard({ icon, title, desc, color }: { icon: any, title: string, desc: string, color: string }) {
  return (
    <div className="bg-white/40 backdrop-blur-sm border border-white/60 p-5 rounded-2xl shadow-sm hover:shadow-lg hover:bg-white/60 transition-all duration-300 flex flex-col items-center text-center md:items-start md:text-left gap-3 group">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color} group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <div>
        <h3 className="font-bold text-slate-800 text-sm mb-1">{title}</h3>
        <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
      </div>
    </div>
  )
}
