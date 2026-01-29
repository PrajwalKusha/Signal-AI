"use client";

import { useState } from "react";
import { SignalCard } from "@/components/SignalCard";
import { StartAnalysis } from "@/components/StartAnalysis";

export default function Home() {
  const [data, setData] = useState<any>(null);

  return (
    <main className="min-h-screen p-8 md:p-12 max-w-3xl mx-auto">
      <header className="mb-12">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">Morning Brief</h1>
        <p className="text-slate-500">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })} • AI Transformation Office
        </p>
      </header>

      {!data ? (
        <StartAnalysis onComplete={setData} />
      ) : (
        <div className="space-y-2 animate-in slide-in-from-bottom-4 duration-500">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-slate-800">Analysis Results</h2>
            <button
              onClick={() => setData(null)}
              className="text-sm text-slate-500 hover:text-slate-800"
            >
              Start New Audit
            </button>
          </div>
          {data.map((signal: any) => (
            <SignalCard key={signal.signal_id} signal={signal} />
          ))}
        </div>
      )}
    </main>
  );
}
