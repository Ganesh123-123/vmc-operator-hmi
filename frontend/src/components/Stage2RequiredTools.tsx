import React, { useState } from 'react';
import {
  Wrench,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  ArrowRight,
  Lock,
  Disc,
  Layers,
  Sparkles
} from 'lucide-react';
import { ToolItem } from '../types';
import { StatusBadge } from './StatusBadge';
import { sound } from '../utils/sound';

interface Stage2RequiredToolsProps {
  tools: ToolItem[];
  onConfirmTool: (id: number) => void;
  onNextStage: () => void;
  loading: boolean;
}

const TOOL_SPECS: Record<string, { diameter: string; flutes: string; overhang: string; holder: string; rpm: string }> = {
  T01: { diameter: 'Ø 50.0 mm', flutes: '5 Inserts (SEHT)', overhang: '45.0 mm', holder: 'BT40-FMA50', rpm: '2,200 RPM' },
  T02: { diameter: 'Ø 10.0 mm', flutes: '4 Flutes Solid Carbide', overhang: '32.0 mm', holder: 'BT40-ER32', rpm: '4,500 RPM' },
  T03: { diameter: 'Ø 6.0 mm', flutes: '2 Flutes 140° Point', overhang: '28.0 mm', holder: 'BT40-ER32', rpm: '3,200 RPM' },
  T04: { diameter: 'Ø 8.0 mm', flutes: '2 Flutes Ball Nose', overhang: '35.0 mm', holder: 'BT40-ER32', rpm: '5,000 RPM' }
};

export const Stage2RequiredTools: React.FC<Stage2RequiredToolsProps> = ({
  tools,
  onConfirmTool,
  onNextStage,
  loading
}) => {
  const [activeToolIndex, setActiveToolIndex] = useState<number>(0);

  if (!tools.length) {
    return (
      <div className="p-8 text-center font-mono text-slate-400">
        Loading cutting tools...
      </div>
    );
  }

  const currentTool = tools[activeToolIndex] || tools[0];
  const isCurrentConfirmed = currentTool.status === 'CONFIRMED';
  const allConfirmed = tools.every((t) => t.status === 'CONFIRMED');
  const confirmedCount = tools.filter((t) => t.status === 'CONFIRMED').length;

  const specs = TOOL_SPECS[currentTool.toolNumber] || {
    diameter: 'Ø Standard',
    flutes: '4 Flutes',
    overhang: '35.0 mm',
    holder: 'BT40',
    rpm: '4,000 RPM'
  };

  const handleNextTool = () => {
    sound.playClick();
    if (activeToolIndex < tools.length - 1) {
      setActiveToolIndex(activeToolIndex + 1);
    }
  };

  const handlePrevTool = () => {
    sound.playClick();
    if (activeToolIndex > 0) {
      setActiveToolIndex(activeToolIndex - 1);
    }
  };

  const handleConfirm = () => {
    sound.playConfirm();
    onConfirmTool(currentTool.id);
  };

  return (
    <div className="flex-1 flex flex-col max-w-5xl mx-auto w-full p-4 md:p-6 gap-6">
      
      {/* Stage Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-cyan-950/60 border border-cyan-800/40 text-cyan-400 font-mono text-xs font-bold uppercase tracking-wider mb-1">
            STAGE 2 • TOOLING PREPARATION
          </div>
          <h2 className="text-2xl md:text-3xl font-mono font-bold text-white tracking-tight">
            Required Tools
          </h2>
        </div>

        {/* Progress pill */}
        <div className="flex items-center gap-3 bg-slate-900 px-4 py-2 rounded-xl border border-slate-800 font-mono text-sm">
          <span className="text-slate-400">STATUS:</span>
          <span className="text-white font-bold">{confirmedCount} of {tools.length} INSTALLED</span>
          <div className="w-24 h-2.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 transition-all duration-300"
              style={{ width: `${(confirmedCount / tools.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left: Large Tool Focus Card */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="industrial-panel p-6 md:p-8 relative overflow-hidden border-2 border-slate-800/90 shadow-2xl">
            
            {/* Tool Header Tag */}
            <div className="flex items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <span className="px-3.5 py-1.5 bg-cyan-950 text-cyan-300 font-mono font-bold text-base rounded-lg border border-cyan-700/60 shadow-glow-cyan/20">
                  TOOL {currentTool.toolNumber}
                </span>
                <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                  TOOL 0{activeToolIndex + 1} OF 0{tools.length}
                </span>
              </div>
              <StatusBadge status={currentTool.status} size="md" />
            </div>

            {/* Tool Details Grid & Geometry Preview */}
            <div className="my-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center text-cyan-400 shrink-0 shadow-inner">
                    <Disc className="w-9 h-9 animate-spin-slow" />
                  </div>
                  <div>
                    <h3 className="text-2xl md:text-3xl font-mono font-bold text-white">
                      {currentTool.description}
                    </h3>
                    <div className="mt-1.5 flex flex-wrap gap-2 text-xs font-mono">
                      <span className="px-2.5 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700">
                        TYPE: <strong className="text-white">{currentTool.type}</strong>
                      </span>
                      <span className="px-2.5 py-1 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                        PURPOSE: <strong className="text-cyan-200">{currentTool.purpose}</strong>
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Technical Tool Geometry Strip */}
              <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 font-mono text-xs">
                <div>
                  <span className="text-slate-500 text-[10px]">DIAMETER</span>
                  <div className="text-cyan-300 font-bold mt-0.5">{specs.diameter}</div>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px]">FLUTES / INSERTS</span>
                  <div className="text-slate-200 font-bold mt-0.5 truncate">{specs.flutes}</div>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px]">TOOL HOLDER</span>
                  <div className="text-amber-300 font-bold mt-0.5">{specs.holder}</div>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px]">OPTIMAL RPM</span>
                  <div className="text-emerald-400 font-bold mt-0.5">{specs.rpm}</div>
                </div>
              </div>

              {/* Tool Instruction */}
              <div className="mt-5 p-5 rounded-xl bg-slate-950/90 border border-slate-800 font-mono text-base md:text-lg text-cyan-100 leading-relaxed shadow-inner">
                <div className="text-xs text-slate-500 mb-1.5 uppercase font-bold flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-cyan-400" />
                  Tool Magazine Loading Instruction
                </div>
                {currentTool.instruction}
              </div>
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
                    <span>TOOL {currentTool.toolNumber} CONFIRMED & LOADED</span>
                  </>
                ) : (
                  <>
                    <Wrench className="w-7 h-7 stroke-[2.5]" />
                    <span>CONFIRM TOOL {currentTool.toolNumber} INSTALLATION</span>
                  </>
                )}
              </button>
            </div>

            {/* Internal Tool Navigation */}
            <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between">
              <button
                onClick={handlePrevTool}
                disabled={activeToolIndex === 0}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 disabled:opacity-30 text-slate-300 font-mono text-sm font-semibold border border-slate-700 transition-colors btn-tactile cursor-pointer disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>PREV TOOL</span>
              </button>

              <span className="text-xs font-mono text-slate-500">
                {activeToolIndex + 1} of {tools.length} Tools
              </span>

              <button
                onClick={handleNextTool}
                disabled={activeToolIndex === tools.length - 1}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 disabled:opacity-30 text-slate-300 font-mono text-sm font-semibold border border-slate-700 transition-colors btn-tactile cursor-pointer disabled:cursor-not-allowed"
              >
                <span>NEXT TOOL</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>

        {/* Right: Tool Magazine Carousel Sidebar */}
        <div className="lg:col-span-4 flex flex-col gap-3">
          <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl">
            <h4 className="font-mono font-bold text-xs text-slate-400 tracking-wider uppercase mb-3 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                TOOL MAGAZINE (4 TOOLS)
              </span>
              <span className="text-cyan-400">{confirmedCount}/{tools.length}</span>
            </h4>

            <div className="space-y-2.5">
              {tools.map((t, idx) => {
                const isSelected = idx === activeToolIndex;
                const isToolConfirmed = t.status === 'CONFIRMED';

                return (
                  <button
                    key={t.id}
                    onClick={() => {
                      sound.playClick();
                      setActiveToolIndex(idx);
                    }}
                    className={`w-full text-left p-3.5 rounded-xl border font-mono transition-all flex flex-col gap-1.5 cursor-pointer ${
                      isSelected
                        ? 'bg-slate-800 border-cyan-500 text-white shadow-glow-cyan/20 ring-1 ring-cyan-500/50'
                        : isToolConfirmed
                        ? 'bg-slate-950/70 border-emerald-900/50 text-slate-300 hover:bg-slate-800/50'
                        : 'bg-slate-950/40 border-slate-800/60 text-slate-500 hover:bg-slate-800/40'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                          isToolConfirmed ? 'bg-emerald-500 text-black' : (isSelected ? 'bg-cyan-500 text-black' : 'bg-slate-800 text-slate-400')
                        }`}>
                          {t.toolNumber}
                        </span>
                        <span className="text-xs font-bold text-slate-200">{t.type}</span>
                      </div>
                      <span className={`text-[10px] font-bold uppercase ${
                        isToolConfirmed ? 'text-emerald-400' : 'text-amber-400'
                      }`}>
                        {isToolConfirmed ? 'LOADED' : 'PENDING'}
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-400 truncate">
                      {t.description} • {t.purpose}
                    </div>
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
              <span>All 4 required cutting tools installed & confirmed.</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-amber-400">
              <Lock className="w-5 h-5" />
              <span>Install and confirm all 4 tools to proceed to Workpiece Setup.</span>
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
          <span>PROCEED TO WORKPIECE SETUP</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>

    </div>
  );
};
