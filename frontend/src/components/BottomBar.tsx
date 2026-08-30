import React from 'react';
import { Layers, FileCode, Crosshair, Wrench, Shield } from 'lucide-react';
import { MachineInfo } from '../types';

interface BottomBarProps {
  machine: MachineInfo | null;
}

export const BottomBar: React.FC<BottomBarProps> = ({ machine }) => {
  return (
    <footer className="w-full bg-slate-950/95 border-t border-slate-800/90 px-4 md:px-8 py-2.5 backdrop-blur-md z-30">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-x-6 gap-y-2 text-xs font-mono">
        
        <div className="flex flex-wrap items-center gap-4 md:gap-6">
          {/* Machine */}
          <div className="flex items-center gap-1.5 text-slate-400">
            <Shield className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-slate-500">MACHINE:</span>
            <span className="text-slate-200 font-bold">{machine?.name || 'VMC-01'}</span>
          </div>

          {/* CNC Program */}
          <div className="flex items-center gap-1.5 text-slate-400">
            <FileCode className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-slate-500">PROGRAM:</span>
            <span className="text-slate-200 font-bold">{machine?.cncProgram || 'PRF_VMC_POCKET_001'}</span>
            <span className="text-cyan-400 bg-cyan-950 px-1 rounded border border-cyan-800/40 text-[10px]">
              {machine?.programRevision || 'REV-B'}
            </span>
          </div>

          {/* Work Offset */}
          <div className="flex items-center gap-1.5 text-slate-400">
            <Crosshair className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-slate-500">OFFSET:</span>
            <span className="text-amber-300 font-bold bg-amber-950/60 px-1.5 py-0.5 rounded border border-amber-800/40">
              {machine?.workOffset || 'G54'}
            </span>
          </div>

          {/* Material */}
          <div className="flex items-center gap-1.5 text-slate-400">
            <Layers className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-500">MATERIAL:</span>
            <span className="text-slate-200 font-semibold">{machine?.material || 'Aluminium 6061-T6'}</span>
          </div>
        </div>

        {/* Fixture */}
        <div className="flex items-center gap-1.5 text-slate-400">
          <Wrench className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-slate-500">FIXTURE:</span>
          <span className="text-slate-300 truncate">{machine?.fixture || 'Precision Vice FV-100'}</span>
        </div>

      </div>
    </footer>
  );
};
