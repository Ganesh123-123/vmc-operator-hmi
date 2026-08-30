import React from 'react';
import { Power, Cpu, ShieldCheck, ArrowRight } from 'lucide-react';
import { MachineInfo } from '../types';

interface StartupSplashProps {
  machine: MachineInfo | null;
  onBeginChecks: () => void;
  loading: boolean;
}

export const StartupSplash: React.FC<StartupSplashProps> = ({
  machine,
  onBeginChecks,
  loading
}) => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center max-w-3xl mx-auto">
      {/* Power Status Icon Badge */}
      <div className="relative mb-6">
        <div className="w-24 h-24 md:w-28 md:h-28 rounded-2xl bg-slate-900 border-2 border-cyan-500/60 flex items-center justify-center text-cyan-400 shadow-glow-cyan/40">
          <Cpu className="w-14 h-14 animate-pulse" />
        </div>
        <span className="absolute -bottom-2 -right-2 bg-emerald-500 text-slate-950 p-2 rounded-xl shadow-glow-green/50">
          <Power className="w-5 h-5 stroke-[3]" />
        </span>
      </div>

      {/* Main Headers */}
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-950/70 border border-emerald-500/50 text-emerald-300 font-mono text-sm font-semibold mb-3">
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
        POWER ON • MACHINE ONLINE
      </div>

      <h1 className="text-3xl md:text-5xl font-mono font-extrabold text-white tracking-tight">
        {machine?.name || 'VMC-01'}
      </h1>

      <p className="mt-2 text-base md:text-lg text-cyan-300/90 font-mono font-medium">
        {machine?.type || '3-Axis Vertical Machining Center'}
      </p>

      {/* Spec details grid */}
      <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 w-full bg-slate-900/80 border border-slate-800 p-4 rounded-xl font-mono text-xs text-left">
        <div className="p-2.5 bg-slate-950/60 rounded border border-slate-800/80">
          <div className="text-slate-500">PROGRAM</div>
          <div className="font-bold text-slate-200 mt-1">{machine?.cncProgram || 'PRF_VMC_POCKET_001'}</div>
        </div>
        <div className="p-2.5 bg-slate-950/60 rounded border border-slate-800/80">
          <div className="text-slate-500">REVISION</div>
          <div className="font-bold text-cyan-400 mt-1">{machine?.programRevision || 'REV-B'}</div>
        </div>
        <div className="p-2.5 bg-slate-950/60 rounded border border-slate-800/80">
          <div className="text-slate-500">WORK OFFSET</div>
          <div className="font-bold text-amber-400 mt-1">{machine?.workOffset || 'G54'}</div>
        </div>
        <div className="p-2.5 bg-slate-950/60 rounded border border-slate-800/80">
          <div className="text-slate-500">MATERIAL</div>
          <div className="font-bold text-slate-200 mt-1">{machine?.material || 'Aluminium 6061-T6'}</div>
        </div>
      </div>

      {/* Primary Action Button */}
      <div className="mt-8 w-full max-w-md">
        <button
          onClick={onBeginChecks}
          disabled={loading}
          className="w-full py-5 px-8 rounded-xl font-mono text-lg md:text-xl font-bold bg-gradient-to-r from-cyan-600 via-cyan-500 to-emerald-500 hover:from-cyan-500 hover:to-emerald-400 text-slate-950 shadow-glow-cyan/40 hover:shadow-glow-cyan/60 flex items-center justify-center gap-3 transition-all btn-tactile cursor-pointer uppercase tracking-wider"
        >
          <ShieldCheck className="w-6 h-6 stroke-[2.5]" />
          <span>START MACHINE CHECKS</span>
          <ArrowRight className="w-6 h-6 stroke-[2.5]" />
        </button>
      </div>

    </div>
  );
};
