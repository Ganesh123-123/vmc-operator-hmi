import React from 'react';
import {
  Play,
  Square,
  Activity,
  Gauge,
  Zap,
  Droplets,
  RotateCw,
  Radio
} from 'lucide-react';
import { OperationTelemetryData, MachineInfo, WorkflowProgress } from '../types';
import { StatusBadge } from './StatusBadge';
import { sound } from '../utils/sound';

interface Stage5OperationProps {
  telemetry: OperationTelemetryData | null;
  machine: MachineInfo | null;
  workflow: WorkflowProgress | null;
  onStart: () => void;
  onStop: () => void;
  loading: boolean;
}

export const Stage5Operation: React.FC<Stage5OperationProps> = ({
  telemetry,
  machine,
  workflow,
  onStart,
  onStop,
  loading
}) => {
  const isRunning = workflow?.operationStatus === 'RUNNING' || telemetry?.status === 'RUNNING';
  const isStopped = workflow?.operationStatus === 'STOPPED' || telemetry?.status === 'STOPPED';

  const elapsedSeconds = telemetry?.elapsedSeconds ?? workflow?.elapsedSeconds ?? 0;

  const formatTimer = (totalSeconds: number) => {
    const hrs = Math.floor(totalSeconds / 3600).toString().padStart(2, '0');
    const mins = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0');
    const secs = (totalSeconds % 60).toString().padStart(2, '0');
    return `${hrs}:${mins}:${secs}`;
  };

  const progress = telemetry?.progressPercentage || 0;

  const handleStart = () => {
    sound.playConfirm();
    onStart();
  };

  const handleStop = () => {
    sound.playAlert();
    onStop();
  };

  return (
    <div className="flex-1 flex flex-col max-w-6xl mx-auto w-full p-4 md:p-6 gap-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-cyan-950/60 border border-cyan-800/40 text-cyan-400 font-mono text-xs font-bold uppercase tracking-wider mb-1">
            STAGE 5 • MACHINING EXECUTION & TELEMETRY
          </div>
          <h2 className="text-2xl md:text-3xl font-mono font-bold text-white tracking-tight">
            Operation Monitor
          </h2>
        </div>

        {/* Machine state badge */}
        <div className="flex items-center gap-3">
          <StatusBadge status={workflow?.operationStatus || 'READY'} size="lg" />
        </div>
      </div>

      {/* Main Execution Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left: Operation Controls & Live Timer (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          
          {/* Main Monitor Display Panel */}
          <div className="industrial-panel p-6 md:p-8 relative overflow-hidden border-2 border-slate-800/90 shadow-2xl">
            
            {/* CNC Program Header */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <span className="text-xs font-mono text-slate-500 uppercase">ACTIVE CNC PROGRAM</span>
                <div className="flex items-center gap-2 mt-0.5">
                  <h3 className="text-xl md:text-2xl font-mono font-bold text-cyan-300">
                    {machine?.cncProgram || 'PRF_VMC_POCKET_001'}
                  </h3>
                  <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800 text-xs font-mono font-bold">
                    {machine?.programRevision || 'REV-B'}
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs font-mono text-slate-500 uppercase">OPERATION</span>
                <div className="text-lg font-mono font-bold text-white">
                  {machine?.operationName || 'POCKET MILLING'}
                </div>
              </div>
            </div>

            {/* Live Visual Machining Animation & Toolpath Simulation */}
            <div className="my-6 p-6 rounded-2xl bg-slate-950 border border-slate-800 relative overflow-hidden">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                
                {/* Spindle graphic & Rotation */}
                <div className="flex items-center gap-5">
                  <div className="relative">
                    <div
                      className={`w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-slate-900 border-2 flex items-center justify-center transition-colors ${
                        isRunning
                          ? 'border-cyan-400 text-cyan-300 shadow-glow-cyan/40'
                          : isStopped
                          ? 'border-red-500 text-red-400'
                          : 'border-emerald-500 text-emerald-400'
                      }`}
                    >
                      <RotateCw
                        className={`w-12 h-12 md:w-14 md:h-14 ${
                          isRunning ? 'animate-spin' : ''
                        }`}
                        style={{ animationDuration: isRunning ? '0.75s' : '0s' }}
                      />
                    </div>
                    {isRunning && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-cyan-400 rounded-full animate-ping" />
                    )}
                  </div>

                  <div>
                    <div className="text-xs font-mono text-slate-400">ACTIVE SPINDLE</div>
                    <div className="text-xl md:text-2xl font-mono font-bold text-white mt-0.5">
                      {isRunning ? '4,500 RPM' : '0 RPM'}
                    </div>
                    <div className="text-xs font-mono text-cyan-400 mt-1 flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5" />
                      <span>{telemetry?.currentTool || 'T01 - 50mm Face Mill'}</span>
                    </div>
                  </div>
                </div>

                {/* Digital Operation Elapsed Timer */}
                <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl text-center sm:text-right font-mono min-w-[200px]">
                  <div className="text-xs text-slate-400 uppercase tracking-wider">ELAPSED TIME</div>
                  <div className="text-3xl md:text-4xl font-bold tracking-tight text-emerald-400 mt-1 font-mono">
                    {formatTimer(elapsedSeconds)}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">CYCLE ESTIMATE: 00:03:00</div>
                </div>

              </div>

              {/* Pocket Milling CAD Toolpath Wireframe Visualizer */}
              <div className="mt-6 p-4 rounded-xl bg-slate-900/60 border border-slate-800 font-mono text-xs">
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="flex items-center gap-1.5">
                    <Radio className="w-3.5 h-3.5 text-cyan-400" />
                    LIVE CNC TOOLPATH SIMULATION (G54 POCKET)
                  </span>
                  <span className="text-cyan-300 font-bold">{progress}% COMPLETE</span>
                </div>
                
                {/* Visual Workpiece Pocket Simulation Area */}
                <div className="h-16 w-full bg-[#070A10] rounded-lg border border-slate-800 relative overflow-hidden flex items-center justify-center">
                  <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#00E5FF_1px,transparent_1px)] [background-size:12px_12px]" />
                  
                  {/* Outer workpiece block border */}
                  <div className="w-[85%] h-[75%] border border-cyan-500/30 rounded relative flex items-center justify-center">
                    {/* Milling pocket path */}
                    <div 
                      className="h-full bg-cyan-500/20 border border-cyan-400/50 rounded transition-all duration-300 relative overflow-hidden"
                      style={{ width: `${progress}%` }}
                    >
                      {isRunning && (
                        <div className="absolute right-0 top-0 bottom-0 w-2 bg-white shadow-[0_0_12px_#00E5FF] animate-pulse" />
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Cycle Progress Bar */}
              <div className="mt-4 pt-3 border-t border-slate-800/80 font-mono">
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-slate-400">POCKET MILLING CYCLE COMPLETION</span>
                  <span className="font-bold text-cyan-400">{progress}%</span>
                </div>
                <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden border border-slate-800 p-0.5">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 via-emerald-400 to-cyan-400 rounded-full transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Primary Action Controls: START / STOP OPERATION */}
            <div className="pt-2">
              {isRunning ? (
                <button
                  onClick={handleStop}
                  disabled={loading}
                  className="w-full py-6 px-8 rounded-2xl font-mono text-xl md:text-2xl font-extrabold uppercase tracking-wider flex items-center justify-center gap-4 transition-all btn-tactile cursor-pointer bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white shadow-glow-red/50 border-2 border-red-400"
                >
                  <Square className="w-8 h-8 fill-current" />
                  <span>STOP OPERATION (HALT CYCLE)</span>
                </button>
              ) : (
                <button
                  onClick={handleStart}
                  disabled={loading}
                  className="w-full py-6 px-8 rounded-2xl font-mono text-xl md:text-2xl font-extrabold uppercase tracking-wider flex items-center justify-center gap-4 transition-all btn-tactile cursor-pointer bg-gradient-to-r from-emerald-500 via-cyan-500 to-emerald-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 shadow-glow-green/40 hover:shadow-glow-green/60 border-2 border-emerald-300"
                >
                  <Play className="w-8 h-8 fill-current" />
                  <span>{isStopped ? 'RESUME / START OPERATION' : 'START OPERATION'}</span>
                </button>
              )}
            </div>

          </div>
        </div>

        {/* Right: Live Telemetry & Machine Parameters (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          
          {/* Live Telemetry Card */}
          <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl shadow-xl font-mono">
            <h4 className="font-bold text-xs text-slate-400 tracking-wider uppercase mb-4 flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="flex items-center gap-2">
                <Gauge className="w-4 h-4 text-cyan-400" />
                TELEMETRY SENSORS
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </h4>

            <div className="space-y-3 text-xs">
              
              {/* Spindle */}
              <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 flex items-center justify-between">
                <span className="text-slate-400">SPINDLE SPEED</span>
                <span className="font-bold text-sm text-cyan-300">
                  {isRunning ? '4,500 RPM' : '0 RPM'}
                </span>
              </div>

              {/* Feed Rate */}
              <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 flex items-center justify-between">
                <span className="text-slate-400">FEED RATE</span>
                <span className="font-bold text-sm text-emerald-300">
                  {isRunning ? '800 mm/min' : '0 mm/min'}
                </span>
              </div>

              {/* Coolant */}
              <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 flex items-center justify-between">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Droplets className="w-3.5 h-3.5 text-cyan-400" />
                  COOLANT FLOW
                </span>
                <span className={`font-bold text-xs px-2 py-0.5 rounded ${
                  isRunning ? 'bg-cyan-950 text-cyan-400 border border-cyan-800' : 'bg-slate-800 text-slate-400'
                }`}>
                  {isRunning ? 'ACTIVE (FLOOD)' : 'OFF'}
                </span>
              </div>

              {/* Work Offset */}
              <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 flex items-center justify-between">
                <span className="text-slate-400">WORK OFFSET</span>
                <span className="font-bold text-sm text-amber-400">
                  {machine?.workOffset || 'G54'}
                </span>
              </div>

              {/* Material */}
              <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 flex items-center justify-between">
                <span className="text-slate-400">STOCK MATERIAL</span>
                <span className="font-bold text-xs text-slate-200">
                  {machine?.material || 'Aluminium 6061-T6'}
                </span>
              </div>

              {/* Fixture */}
              <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 flex items-center justify-between">
                <span className="text-slate-400">FIXTURE</span>
                <span className="font-bold text-xs text-slate-200 truncate">
                  {machine?.fixture || 'FV-100 Vice'}
                </span>
              </div>

            </div>
          </div>

          {/* Operation Status Summary Card */}
          <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl text-xs font-mono text-slate-400">
            <div className="flex items-center gap-2 text-slate-300 font-bold mb-2">
              <Activity className="w-4 h-4 text-cyan-400" />
              <span>SAFETY INTERLOCKS</span>
            </div>
            <p className="leading-relaxed text-[11px]">
              Guards and doors are locked during active spindle cycle. Emergency Stop remains active at control panel.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};
