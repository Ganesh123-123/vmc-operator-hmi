import React, { useState } from 'react';
import {
  Box,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  ArrowRight,
  Lock,
  Compass,
  Ruler,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { WorkpieceItem } from '../types';
import { StatusBadge } from './StatusBadge';
import { sound } from '../utils/sound';

interface Stage3WorkpieceSetupProps {
  workpieceItems: WorkpieceItem[];
  onConfirmItem: (id: number) => void;
  onNextStage: () => void;
  loading: boolean;
}

export const Stage3WorkpieceSetup: React.FC<Stage3WorkpieceSetupProps> = ({
  workpieceItems,
  onConfirmItem,
  onNextStage,
  loading
}) => {
  const [activeIndex, setActiveIndex] = useState<number>(0);

  if (!workpieceItems.length) {
    return (
      <div className="p-8 text-center font-mono text-slate-400">
        Loading workpiece setup instructions...
      </div>
    );
  }

  const currentItem = workpieceItems[activeIndex] || workpieceItems[0];
  const isCurrentConfirmed = currentItem.status === 'CONFIRMED';
  const allConfirmed = workpieceItems.every((w) => w.status === 'CONFIRMED');
  const confirmedCount = workpieceItems.filter((w) => w.status === 'CONFIRMED').length;

  const handleNext = () => {
    sound.playClick();
    if (activeIndex < workpieceItems.length - 1) {
      setActiveIndex(activeIndex + 1);
    }
  };

  const handlePrev = () => {
    sound.playClick();
    if (activeIndex > 0) {
      setActiveIndex(activeIndex - 1);
    }
  };

  const handleConfirm = () => {
    sound.playConfirm();
    onConfirmItem(currentItem.id);
  };

  return (
    <div className="flex-1 flex flex-col max-w-5xl mx-auto w-full p-4 md:p-6 gap-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-cyan-950/60 border border-cyan-800/40 text-cyan-400 font-mono text-xs font-bold uppercase tracking-wider mb-1">
            STAGE 3 • FIXTURE & WORKPIECE CLAMPING
          </div>
          <h2 className="text-2xl md:text-3xl font-mono font-bold text-white tracking-tight">
            Workpiece Setup
          </h2>
        </div>

        {/* Progress pill */}
        <div className="flex items-center gap-3 bg-slate-900 px-4 py-2 rounded-xl border border-slate-800 font-mono text-sm">
          <span className="text-slate-400">STATUS:</span>
          <span className="text-white font-bold">{confirmedCount} of {workpieceItems.length} CONFIRMED</span>
          <div className="w-24 h-2.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 transition-all duration-300"
              style={{ width: `${(confirmedCount / workpieceItems.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Machining Drawing & Fixture Context Banner */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-slate-900/90 border border-slate-800 p-4 rounded-xl font-mono text-xs">
        <div className="p-2.5 bg-slate-950/70 rounded-lg border border-slate-800">
          <div className="text-slate-500 flex items-center gap-1.5">
            <Ruler className="w-3.5 h-3.5 text-cyan-400" />
            <span>DIMENSIONS</span>
          </div>
          <div className="font-bold text-slate-200 mt-1">100 × 80 × 25 mm</div>
        </div>

        <div className="p-2.5 bg-slate-950/70 rounded-lg border border-slate-800">
          <div className="text-slate-500 flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-amber-400" />
            <span>WORK OFFSET</span>
          </div>
          <div className="font-bold text-amber-300 mt-1">G54 (X0/Y0 Lower-Left)</div>
        </div>

        <div className="p-2.5 bg-slate-950/70 rounded-lg border border-slate-800">
          <div className="text-slate-500 flex items-center gap-1.5">
            <Box className="w-3.5 h-3.5 text-emerald-400" />
            <span>FIXTURE</span>
          </div>
          <div className="font-bold text-slate-200 mt-1 truncate">FV-100 Precision Vice</div>
        </div>

        <div className="p-2.5 bg-slate-950/70 rounded-lg border border-slate-800">
          <div className="text-slate-500 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
            <span>ORIENTATION</span>
          </div>
          <div className="font-bold text-cyan-300 mt-1">Datum A Facing Upward</div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left: Active Instruction Card */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="industrial-panel p-6 md:p-8 relative overflow-hidden border-2 border-slate-800/90 shadow-2xl">
            
            {/* Top Indicator */}
            <div className="flex items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <span className="px-3.5 py-1.5 bg-cyan-950 text-cyan-300 font-mono font-bold text-sm rounded-lg border border-cyan-700/60">
                  STEP 0{currentItem.orderIndex} / 0{workpieceItems.length}
                </span>
                <span className="text-xs font-mono text-slate-400">
                  {currentItem.title}
                </span>
              </div>
              <StatusBadge status={currentItem.status} size="md" />
            </div>

            {/* Instruction Body */}
            <div className="my-6">
              <h3 className="text-2xl md:text-3xl font-mono font-bold text-white tracking-wide">
                {currentItem.instruction}
              </h3>

              {currentItem.detail && (
                <div className="mt-4 p-5 rounded-xl bg-slate-950/90 border border-slate-800 font-mono text-sm md:text-base text-cyan-200/90 leading-relaxed shadow-inner">
                  <div className="text-xs text-slate-500 mb-1 uppercase font-bold flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                    Standard Machine Operator Procedure
                  </div>
                  {currentItem.detail}
                </div>
              )}
            </div>

            {/* Primary Action Button */}
            <div className="pt-2">
              <button
                onClick={handleConfirm}
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
                    <span>STEP {currentItem.orderIndex} CONFIRMED</span>
                  </>
                ) : (
                  <>
                    <Box className="w-7 h-7 stroke-[2.5]" />
                    <span>CONFIRM STEP #{currentItem.orderIndex}</span>
                  </>
                )}
              </button>
            </div>

            {/* Step Navigation */}
            <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between">
              <button
                onClick={handlePrev}
                disabled={activeIndex === 0}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 disabled:opacity-30 text-slate-300 font-mono text-sm font-semibold border border-slate-700 transition-colors btn-tactile cursor-pointer disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>PREVIOUS STEP</span>
              </button>

              <span className="text-xs font-mono text-slate-500">
                {activeIndex + 1} of {workpieceItems.length} Steps
              </span>

              <button
                onClick={handleNext}
                disabled={activeIndex === workpieceItems.length - 1}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 disabled:opacity-30 text-slate-300 font-mono text-sm font-semibold border border-slate-700 transition-colors btn-tactile cursor-pointer disabled:cursor-not-allowed"
              >
                <span>NEXT STEP</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>

        {/* Right: Step Sequence Navigator */}
        <div className="lg:col-span-4 flex flex-col gap-3">
          <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl">
            <h4 className="font-mono font-bold text-xs text-slate-400 tracking-wider uppercase mb-3 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                SETUP SEQUENCE (6 STEPS)
              </span>
              <span className="text-cyan-400">{confirmedCount}/{workpieceItems.length}</span>
            </h4>

            <div className="space-y-2">
              {workpieceItems.map((item, idx) => {
                const isSelected = idx === activeIndex;
                const isItemConfirmed = item.status === 'CONFIRMED';

                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      sound.playClick();
                      setActiveIndex(idx);
                    }}
                    className={`w-full text-left p-3 rounded-lg border font-mono text-xs transition-all flex items-center justify-between gap-2.5 cursor-pointer ${
                      isSelected
                        ? 'bg-slate-800 border-cyan-500 text-white shadow-glow-cyan/10'
                        : isItemConfirmed
                        ? 'bg-slate-950/60 border-emerald-900/40 text-slate-300 hover:bg-slate-800/50'
                        : 'bg-slate-950/40 border-slate-800/60 text-slate-500 hover:bg-slate-800/40'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <span className={`w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold ${
                        isItemConfirmed ? 'bg-emerald-500 text-black' : (isSelected ? 'bg-cyan-500 text-black' : 'bg-slate-800 text-slate-400')
                      }`}>
                        {isItemConfirmed ? <CheckCircle2 className="w-3.5 h-3.5" /> : idx + 1}
                      </span>
                      <span className="truncate">{item.title}</span>
                    </div>

                    <span className={`text-[10px] font-bold uppercase shrink-0 ${
                      isItemConfirmed ? 'text-emerald-400' : 'text-amber-400'
                    }`}>
                      {isItemConfirmed ? 'VERIFIED' : 'PENDING'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

      </div>

      {/* Bottom Gating Bar */}
      <div className="bg-slate-900/90 border border-slate-800 p-4 md:p-5 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4 mt-auto">
        <div className="flex items-center gap-3 text-sm font-mono">
          {allConfirmed ? (
            <div className="flex items-center gap-2 text-emerald-400">
              <CheckCircle2 className="w-5 h-5" />
              <span>All 6 workpiece setup steps confirmed. Ready for Final Review.</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-amber-400">
              <Lock className="w-5 h-5" />
              <span>Confirm all 6 workpiece setup items to proceed to Ready Review.</span>
            </div>
          )}
        </div>

        <button
          onClick={() => {
            sound.playClick();
            onNextStage();
          }}
          disabled={!allConfirmed || loading}
          className="w-full sm:w-auto px-8 py-4 rounded-xl font-mono text-base font-bold flex items-center justify-center gap-2.5 transition-all btn-tactile cursor-pointer disabled:cursor-not-allowed disabled:opacity-40 bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white shadow-glow-green/30"
        >
          <span>PROCEED TO READY REVIEW</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>

    </div>
  );
};
