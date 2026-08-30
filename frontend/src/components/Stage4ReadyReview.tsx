import React from 'react';
import { ShieldCheck, CheckCircle2, ArrowRight, Wrench, Box, Cpu, AlertTriangle } from 'lucide-react';
import { ReadyReviewData, WorkflowProgress } from '../types';

interface Stage4ReadyReviewProps {
  readyReview: ReadyReviewData | null;
  workflow: WorkflowProgress | null;
  onProceedToOperation: () => void;
  loading: boolean;
}

export const Stage4ReadyReview: React.FC<Stage4ReadyReviewProps> = ({
  readyReview,
  workflow,
  onProceedToOperation,
  loading
}) => {
  const isReady = readyReview?.isReady ?? workflow?.isReady ?? false;
  const categories = readyReview?.categories;

  return (
    <div className="flex-1 flex flex-col max-w-6xl mx-auto w-full p-4 md:p-6 gap-6">
      
      {/* Header */}
      <div className="border-b border-slate-800 pb-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-cyan-950/60 border border-cyan-800/40 text-cyan-400 font-mono text-xs font-bold uppercase tracking-wider mb-1">
          STAGE 4 • COMPREHENSIVE READINESS REVIEW
        </div>
        <h2 className="text-2xl md:text-3xl font-mono font-bold text-white tracking-tight">
          Ready Review
        </h2>
        <p className="text-sm font-mono text-slate-400 mt-1">
          Final safety & operational sign-off before spindle start.
        </p>
      </div>

      {/* Large READY Banner */}
      <div
        className={`p-6 md:p-8 rounded-2xl border-2 transition-all text-center relative overflow-hidden ${
          isReady
            ? 'bg-gradient-to-b from-emerald-950/90 to-slate-950 border-emerald-500 shadow-glow-green/30 ring-1 ring-emerald-400/40'
            : 'bg-slate-950 border-amber-500/60 shadow-glow-amber/20'
        }`}
      >
        <div className="flex flex-col items-center justify-center gap-3">
          <div
            className={`w-16 h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center ${
              isReady
                ? 'bg-emerald-500 text-slate-950 shadow-[0_0_20px_#10B981]'
                : 'bg-amber-500 text-slate-950'
            }`}
          >
            {isReady ? (
              <CheckCircle2 className="w-10 h-10 md:w-12 md:h-12 stroke-[2.8]" />
            ) : (
              <AlertTriangle className="w-10 h-10 md:w-12 md:h-12 stroke-[2.5]" />
            )}
          </div>

          <h3
            className={`text-3xl md:text-5xl font-mono font-extrabold tracking-wider uppercase ${
              isReady ? 'text-emerald-400' : 'text-amber-400'
            }`}
          >
            {isReady ? '✓ READY' : 'SETUP INCOMPLETE'}
          </h3>

          <p className="text-sm md:text-lg font-mono text-slate-300 max-w-xl">
            {isReady
              ? 'Machine, tooling and workpiece setup complete. Ready to engage machining sequence.'
              : 'Some startup checks, tools, or workpiece clamping items are still pending verification.'}
          </p>
        </div>
      </div>

      {/* 3 Checklist Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* 1. Machine Checks Column */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-xl flex flex-col">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
            <div className="flex items-center gap-2 text-cyan-300 font-mono font-bold text-sm">
              <Cpu className="w-4 h-4 text-cyan-400" />
              <span>1. MACHINE CHECKS</span>
            </div>
            <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
              categories?.machineChecks.isComplete ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-amber-950 text-amber-400'
            }`}>
              {categories?.machineChecks.isComplete ? '6/6 VERIFIED' : 'PENDING'}
            </span>
          </div>

          <div className="space-y-2.5 flex-1 font-mono text-xs">
            {categories?.machineChecks.items.map((item) => (
              <div
                key={item.id}
                className="flex items-start gap-2.5 p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span className="text-slate-200 leading-snug">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 2. Tools Column */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-xl flex flex-col">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
            <div className="flex items-center gap-2 text-cyan-300 font-mono font-bold text-sm">
              <Wrench className="w-4 h-4 text-cyan-400" />
              <span>2. REQUIRED TOOLS</span>
            </div>
            <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
              categories?.requiredTools.isComplete ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-amber-950 text-amber-400'
            }`}>
              {categories?.requiredTools.isComplete ? '4/4 VERIFIED' : 'PENDING'}
            </span>
          </div>

          <div className="space-y-2.5 flex-1 font-mono text-xs">
            {categories?.requiredTools.items.map((item) => (
              <div
                key={item.id}
                className="flex items-start gap-2.5 p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span className="text-slate-200 leading-snug">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Workpiece Column */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-xl flex flex-col">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
            <div className="flex items-center gap-2 text-cyan-300 font-mono font-bold text-sm">
              <Box className="w-4 h-4 text-cyan-400" />
              <span>3. WORKPIECE SETUP</span>
            </div>
            <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
              categories?.workpieceSetup.isComplete ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-amber-950 text-amber-400'
            }`}>
              {categories?.workpieceSetup.isComplete ? '6/6 VERIFIED' : 'PENDING'}
            </span>
          </div>

          <div className="space-y-2.5 flex-1 font-mono text-xs">
            {categories?.workpieceSetup.items.map((item) => (
              <div
                key={item.id}
                className="flex items-start gap-2.5 p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span className="text-slate-200 leading-snug">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Primary Proceed CTA Button */}
      <div className="pt-2">
        <button
          onClick={onProceedToOperation}
          disabled={!isReady || loading}
          className="w-full py-5 px-8 rounded-xl font-mono text-xl md:text-2xl font-extrabold uppercase tracking-wider flex items-center justify-center gap-4 transition-all btn-tactile cursor-pointer disabled:cursor-not-allowed disabled:opacity-40 bg-gradient-to-r from-cyan-500 via-emerald-500 to-cyan-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 shadow-glow-green/40 hover:shadow-glow-green/60"
        >
          <ShieldCheck className="w-7 h-7 stroke-[2.8]" />
          <span>PROCEED TO OPERATION</span>
          <ArrowRight className="w-7 h-7 stroke-[2.8]" />
        </button>
      </div>

    </div>
  );
};
