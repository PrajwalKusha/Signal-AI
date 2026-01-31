"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Zap, Brain, TrendingUp } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Subtle grid overlay */}
      <div
        className="fixed inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.5) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(255, 255, 255, 0.5) 1px, transparent 1px)`,
          backgroundSize: '64px 64px'
        }}
      />

      <div className="relative">
        {/* Hero Section */}
        <section className="min-h-screen flex items-center justify-center px-6">
          <div className="max-w-5xl mx-auto text-center">
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-12 flex justify-center"
            >
              <div className="w-20 h-20">
                <Image
                  src="/signal.svg"
                  alt="Signals"
                  width={80}
                  height={80}
                  className="w-full h-full"
                />
              </div>
            </motion.div>

            {/* Main Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-7xl md:text-8xl font-bold mb-6 tracking-tight"
              style={{ fontFamily: 'var(--font-geist-sans)' }}
            >
              <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
                Signals
              </span>
            </motion.h1>

            {/* Tagline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl md:text-2xl text-slate-400 mb-4 font-light tracking-wide"
            >
              Transform data into actionable intelligence
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-base md:text-lg text-slate-500 mb-12 max-w-2xl mx-auto"
            >
              AI-powered analysis that uncovers patterns, predicts trends, and drives smarter decisions
            </motion.p>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Link href="/login">
                <button className="group relative inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-8 py-4 rounded-lg font-medium text-lg transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/25 hover:scale-105">
                  Get Started
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </button>
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 px-6">
          <div className="max-w-6xl mx-auto">
            {/* Section Title */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Built for Intelligence
              </h2>
              <p className="text-lg text-slate-400">
                Everything you need to turn raw data into insights
              </p>
            </motion.div>

            {/* Feature Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <FeatureCard
                icon={<Zap className="w-8 h-8" />}
                title="Real-time Analysis"
                description="Process data instantly with AI agents that work 24/7"
                delay={0}
              />
              <FeatureCard
                icon={<Brain className="w-8 h-8" />}
                title="Smart Predictions"
                description="Machine learning models that forecast what's coming next"
                delay={0.1}
              />
              <FeatureCard
                icon={<TrendingUp className="w-8 h-8" />}
                title="Actionable Insights"
                description="Clear recommendations that drive better business decisions"
                delay={0.2}
              />
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center"
          >
            <div className="bg-gradient-to-br from-slate-900/50 to-slate-800/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Ready to unlock your data's potential?
              </h2>
              <p className="text-lg text-slate-400 mb-8">
                Join teams making smarter decisions with AI-powered insights
              </p>
              <Link href="/login">
                <button className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-8 py-4 rounded-lg font-medium text-lg transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/25 hover:scale-105">
                  Start Analyzing
                  <ArrowRight className="w-5 h-5" />
                </button>
              </Link>
            </div>
          </motion.div>
        </section>
      </div>
    </div>
  );
}

// Feature Card Component
function FeatureCard({
  icon,
  title,
  description,
  delay,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      className="group relative bg-gradient-to-br from-slate-900/50 to-slate-800/50 backdrop-blur-sm border border-slate-800 rounded-xl p-8 transition-all duration-300 hover:border-emerald-500/50 hover:shadow-lg hover:shadow-emerald-500/10"
    >
      {/* Icon */}
      <div className="inline-flex items-center justify-center w-14 h-14 rounded-lg bg-gradient-to-br from-emerald-500/10 to-teal-500/10 text-emerald-400 mb-6 transition-transform duration-300 group-hover:scale-110">
        {icon}
      </div>

      {/* Content */}
      <h3 className="text-xl font-semibold text-white mb-3">{title}</h3>
      <p className="text-slate-400 leading-relaxed">{description}</p>
    </motion.div>
  );
}
