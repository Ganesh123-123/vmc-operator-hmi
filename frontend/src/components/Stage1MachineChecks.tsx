import React, { useState } from 'react';
import { ShieldCheck, CheckCircle2, ChevronRight, ChevronLeft, ArrowRight, Lock, Check } from 'lucide-react';
import { MachineCheckItem } from '../types';
import { StatusBadge } from './StatusBadge';

interface Stage1MachineChecksProps {
  checks: MachineCheckItem[];
  onConfirmCheck: (id: number) => void;
  onNextStage: () => void;
  loading: boolean;
}

export const Stage1MachineChecks: React.FC<Stage1MachineChecksProps> = ({
  checks,
  onConfirmCheck,
  onNextStage,
  loading
}) => {
  const [activeCheckIndex, setActiveCheckIndex] = useState<number>(0);

  if (!checks.length) {
    return (
      <div className="p-8 text-center font-mono text-slate-400">
        Loading machine checks...
      </div>
    );
  }

  const currentCheck = checks[activeCheckIndex] || checks[0];
  const isCurrentConfirmed = currentCheck.status === 'CONFIRMED';
  const allConfirmed = checks.every((c) => c.status === 'CONFIRMED');
  const confirmedCount = checks.filter((c) => c.status === 'CONFIRMED').length;

  const handleNextCheck = () => {
    if (activeCheckIndex < checks.length - 1) {
      setActiveCheckIndex(activeCheckIndex + 1);
    }
  };

  const handlePrevCheck = () => {
    if (activeCheckIndex > 0) {
      setActiveCheckIndex(activeCheckIndex - 1);
    }
  };

  return (
    <div className="flex-1 flex flex-col max-w-5xl mx-auto w-full p-4 md:p-6 gap-6">
      
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-cyan-950/60 border border-cyan-800/40 text-cyan-400 font-mono text-xs font-bold uppercase tracking-wider mb-1">
            STAGE 1 • PRE-START INSPECTION
          </div>
          <h2 className="text-2xl md:text-3xl font-mono font-bold text-white tracking-tight">
            Machine Checks
          </h2>
        </div>

        {/* Mini progress tracker */}
        <div className="flex items-center gap-3 bg-slate-900 px-4 py-2 rounded-xl border border-slate-800 font-mono text-sm">
          <span className="text-slate-400">STATUS:</span>
          <span className="text-white font-bold">{confirmedCount} of {checks.length} CONFIRMED</span>
          <div className="w-24 h-2.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 transition-all duration-300"
              style={{ width: `${(confirmedCount / checks.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Grid: Focus Instruction Card + Check Sequence Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left / Center: Large Single-Focus Instruction Card */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="industrial-panel p-6 md:p-8 relative overflow-hidden border-2 border-slate-800/90 shadow-2xl">
            
            {/* Top Indicator */}
            <div className="flex items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2.5">
                <span className="px-3 py-1 bg-cyan-950 text-cyan-300 font-mono font-bold text-sm rounded border border-cyan-800/50">
                  CHECK 0{currentCheck.orderIndex} / 0{checks.length}
                </span>
                <span className="text-xs font-mono text-slate-500 hidden sm:inline">
                  VMC-01 CNC STARTUP SAFETY
                </span>
              </div>
              <StatusBadge status={currentCheck.status} size="md" />
            </div>

            {/* Check Title & Instruction */}
            <div className="my-6">
              <h3 className="text-xl md:text-2xl font-mono font-bold text-white tracking-wide">
                {currentCheck.title}
              </h3>
              <div className="mt-4 p-5 rounded-xl bg-slate-950/70 border border-slate-800/80 font-mono text-base md:text-lg text-cyan-100/90 leading-relaxed">
                {currentCheck.description}
              </div>
            </div>

            {/* Large Primary Action Button */}
            <div className="pt-2">
              <button
                onClick={() => onConfirmCheck(currentCheck.id)}
                disabled={loading || isCurrentConfirmed}
                className={`w-full py-5 px-8 rounded-xl font-mono text-lg md:text-xl font-bold tracking-wider uppercase flex items-center justify-center gap-3 transition-all btn-tactile ${
                  isCurrentConfirmed
                    ? 'bg-emerald-950/90 text-emerald-300 border-2 border-emerald-500/60 shadow-glow-green/20 cursor-default'
                    : 'bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 shadow-glow-cyan/40 hover:shadow-glow-cyan/60 cursor-pointer'
                }`}
              >
                {isCurrentConfirmed ? (
                  <>
                    <CheckCircle2 className="w-7 h-7 text-emerald-400 stroke-[2.5]" />
                    <span>CHECK CONFIRMED</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-7 h-7 stroke-[2.5]" />
                    <span>CONFIRM CHECK #{currentCheck.orderIndex}</span>
                  </>
                )}
              </button>
            </div>

            {/* Navigation within checks */}
            <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between">
              <button
                onClick={handlePrevCheck}
                disabled={activeCheckIndex === 0}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 disabled:opacity-30 text-slate-300 font-mono text-sm font-semibold border border-slate-700 transition-colors btn-tactile cursor-pointer disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>PREVIOUS CHECK</span>
              </button>

              <span className="text-xs font-mono text-slate-500">
                {activeCheckIndex + 1} of {checks.length}
              </span>

              <button
                onClick={handleNextCheck}
                disabled={activeCheckIndex === checks.length - 1}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 disabled:opacity-30 text-slate-300 font-mono text-sm font-semibold border border-slate-700 transition-colors btn-tactile cursor-pointer disabled:cursor-not-allowed"
              >
                <span>NEXT CHECK</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>

        {/* Right: Sequence Checklist Navigator */}
        <div className="lg:col-span-4 flex flex-col gap-3">
          <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl">
            <h4 className="font-mono font-bold text-xs text-slate-400 tracking-wider uppercase mb-3 flex items-center justify-between">
              <span>CHECKLIST SEQUENCE</span>
              <span className="text-cyan-400">{confirmedCount}/{checks.length}</span>
            </h4>

            <div className="space-y-2">
              {checks.map((item, idx) => {
                const isSelected = idx === activeCheckIndex;
                const isItemConfirmed = item.status === 'CONFIRMED';

                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveCheckIndex(idx)}
                    className={`w-full text-left p-3 rounded-lg border font-mono text-xs transition-all flex items-center justify-between gap-2.5 cursor-pointer ${
                      isSelected
                        ? 'bg-slate-800 border-cyan-500/80 text-white shadow-glow-cyan/10'
                        : isItemConfirmed
                        ? 'bg-slate-950/60 border-emerald-900/40 text-slate-300 hover:bg-slate-800/50'
                        : 'bg-slate-950/40 border-slate-800/60 text-slate-500 hover:bg-slate-800/40'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <span className={`w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold ${
                        isItemConfirmed ? 'bg-emerald-500 text-black' : (isSelected ? 'bg-cyan-500 text-black' : 'bg-slate-800 text-slate-400')
                      }`}>
                        {isItemConfirmed ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : idx + 1}
                      </span>
                      <span className="truncate">{item.title}</span>
                    </div>

                    <span className={`text-[10px] font-bold uppercase shrink-0 ${
                      isItemConfirmed ? 'text-emerald-400' : 'text-amber-400'
                    }`}>
                      {isItemConfirmed ? 'OK' : 'PENDING'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

      </div>

      {/* Next Stage Gating Bar */}
      <div className="bg-slate-900/90 border border-slate-800 p-4 md:p-5 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4 mt-auto">
        <div className="flex items-center gap-3 text-sm font-mono">
          {allConfirmed ? (
            <div className="flex items-center gap-2 text-emerald-400">
              <CheckCircle2 className="w-5 h-5" />
              <span>All 6 machine checks verified. Ready for Required Tools.</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-amber-400">
              <Lock className="w-5 h-5" />
              <span>Complete all 6 machine checks to proceed to Stage 2.</span>
            </div>
          )}
        </div>

        <button
          onClick={onNextStage}
          disabled={!allConfirmed || loading}
          className="w-full sm:w-auto px-8 py-4 rounded-xl font-mono text-base font-bold flex items-center justify-center gap-2.5 transition-all btn-tactile cursor-pointer disabled:cursor-not-allowed disabled:opacity-40 bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white shadow-glow-green/30"
        >
          <span>PROCEED TO REQUIRED TOOLS</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>

    </div>
  );
};
