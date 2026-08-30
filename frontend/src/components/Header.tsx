import React, { useState, useEffect } from 'react';
import { Power, RotateCcw, Cpu, Activity, LayoutDashboard, Wrench, User, LogOut } from 'lucide-react';
import { MachineInfo, WorkflowProgress, OperatorProfile } from '../types';
import { StatusBadge } from './StatusBadge';

interface HeaderProps {
  machine: MachineInfo | null;
  workflow: WorkflowProgress | null;
  operator: OperatorProfile | null;
  activeView: 'hmi' | 'dashboard';
  onChangeView: (view: 'hmi' | 'dashboard') => void;
  onLogout: () => void;
  onResetClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  machine,
  workflow,
  operator,
  activeView,
  onChangeView,
  onLogout,
  onResetClick
}) => {
  const [time, setTime] = useState<string>('');

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString('en-US', {
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        })
      );
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  const machineStatus =
    workflow?.operationStatus === 'RUNNING'
      ? 'RUNNING'
      : workflow?.operationStatus === 'STOPPED'
      ? 'STOPPED'
      : machine?.status || 'ONLINE';

  return (
    <header className="w-full bg-slate-950/95 border-b border-slate-800/90 px-4 md:px-8 py-3 sticky top-0 z-40 backdrop-blur-md shadow-2xl">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
        
        {/* Left: Machine Brand & Navigation View Tabs */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-900 to-slate-900 border border-cyan-500/40 text-cyan-300 shadow-glow-cyan/20">
              <Cpu className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-lg md:text-xl font-bold tracking-tight text-white">
                  {machine?.name || 'VMC-01'}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800/60 font-mono font-normal">
                  3-AXIS
                </span>
              </div>
              <p className="text-[11px] font-mono text-slate-400">
                PRIMEFORM LABS HMI
              </p>
            </div>
          </div>

          {/* View Switcher Pills */}
          <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-slate-800 font-mono text-xs">
            <button
              onClick={() => onChangeView('hmi')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeView === 'hmi'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-glow-cyan/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Wrench className="w-3.5 h-3.5" />
              <span>HMI GUIDANCE</span>
            </button>

            <button
              onClick={() => onChangeView('dashboard')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeView === 'dashboard'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-glow-cyan/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>DASHBOARD</span>
            </button>
          </div>
        </div>

        {/* Center: Live Telemetry Badges */}
        <div className="flex flex-wrap items-center gap-2 md:gap-3 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800">
          <div className="flex items-center gap-1.5 text-xs font-mono text-slate-400">
            <span className="text-slate-500">PWR:</span>
            <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-800/50 text-[11px]">
              <Power className="w-3 h-3 text-emerald-400" />
              ON
            </span>
          </div>

          <div className="h-4 w-px bg-slate-800 hidden sm:block" />

          <div className="flex items-center gap-1.5 text-xs font-mono">
            <span className="text-slate-500">STATE:</span>
            <StatusBadge status={machineStatus} size="sm" />
          </div>

          <div className="h-4 w-px bg-slate-800 hidden sm:block" />

          <div className="flex items-center gap-1.5 text-xs font-mono">
            <span className="text-slate-500">JOB:</span>
            <span className="text-cyan-300 font-semibold uppercase tracking-wider bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-900/40 text-[11px] flex items-center gap-1">
              <Activity className="w-3 h-3 text-cyan-400" />
              {machine?.operationName || 'POCKET MILLING'}
            </span>
          </div>
        </div>

        {/* Right: Operator Badge, Clock, Reset & Logout */}
        <div className="flex items-center justify-between md:justify-end gap-3 font-mono">
          
          {/* Operator Profile Tag */}
          <div className="hidden lg:flex items-center gap-2 bg-slate-900 px-2.5 py-1.5 rounded-lg border border-slate-800 text-xs">
            <User className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-slate-300 font-bold">{operator?.username || 'operator'}</span>
          </div>

          {/* UTC Clock */}
          <div className="text-xs md:text-sm font-semibold text-slate-300 bg-slate-900 px-2.5 py-1.5 rounded-lg border border-slate-800">
            <span className="text-cyan-400">{time || '00:00:00'}</span>
          </div>

          {/* Reset Action */}
          <button
            onClick={onResetClick}
            title="Reset Workflow to Stage 1"
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-amber-400 bg-slate-900/90 hover:bg-slate-800 px-2.5 py-2 rounded-lg border border-slate-800 hover:border-amber-500/40 transition-colors btn-tactile cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">RESET</span>
          </button>

          {/* Logout Action */}
          <button
            onClick={onLogout}
            title="Log Out Operator"
            className="flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300 bg-slate-900/90 hover:bg-red-950/40 px-2.5 py-2 rounded-lg border border-slate-800 hover:border-red-500/40 transition-colors btn-tactile cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">LOGOUT</span>
          </button>
        </div>

      </div>
    </header>
  );
};
