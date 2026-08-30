import React from 'react';
import { Check, ShieldCheck, Wrench, Box, Eye, Play } from 'lucide-react';
import { StageName, WorkflowProgress } from '../types';

interface ProgressStepperProps {
  workflow: WorkflowProgress | null;
  onSelectStage?: (stage: StageName) => void;
}

interface StepConfig {
  id: StageName;
  number: number;
  label: string;
  shortLabel: string;
  icon: React.ComponentType<{ className?: string }>;
  getItemCount?: (summary: WorkflowProgress['summary']) => { confirmed: number; total: number };
}

const STEPS: StepConfig[] = [
  {
    id: 'STAGE_1_CHECKS',
    number: 1,
    label: 'MACHINE CHECKS',
    shortLabel: 'CHECKS',
    icon: ShieldCheck,
    getItemCount: (s) => ({ confirmed: s.machineChecksConfirmed, total: s.machineChecksTotal })
  },
  {
    id: 'STAGE_2_TOOLS',
    number: 2,
    label: 'REQUIRED TOOLS',
    shortLabel: 'TOOLS',
    icon: Wrench,
    getItemCount: (s) => ({ confirmed: s.toolsConfirmed, total: s.toolsTotal })
  },
  {
    id: 'STAGE_3_WORKPIECE',
    number: 3,
    label: 'WORKPIECE SETUP',
    shortLabel: 'WORKPIECE',
    icon: Box,
    getItemCount: (s) => ({ confirmed: s.workpieceConfirmed, total: s.workpieceTotal })
  },
  {
    id: 'STAGE_4_READY',
    number: 4,
    label: 'READY REVIEW',
    shortLabel: 'READY',
    icon: Eye
  },
  {
    id: 'STAGE_5_OPERATION',
    number: 5,
    label: 'OPERATION',
    shortLabel: 'OPERATION',
    icon: Play
  }
];

export const ProgressStepper: React.FC<ProgressStepperProps> = ({ workflow }) => {
  if (!workflow) return null;

  const currentStage = workflow.currentStage;
  const currentStepIndex = STEPS.findIndex((s) => s.id === currentStage);

  return (
    <div className="w-full bg-slate-950/70 border-b border-slate-800/80 px-4 md:px-8 py-3.5">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-5 gap-2 md:gap-4 items-center">
          {STEPS.map((step, idx) => {
            const isCurrent = step.id === currentStage;
            const isCompleted = idx < currentStepIndex || (step.id === 'STAGE_4_READY' && workflow.isReady);

            const counts = step.getItemCount ? step.getItemCount(workflow.summary) : null;

            return (
              <div
                key={step.id}
                className={`relative flex flex-col md:flex-row items-center gap-2 md:gap-3 p-2 md:p-3 rounded-lg border transition-all select-none ${
                  isCurrent
                    ? 'bg-slate-900 border-cyan-500/80 shadow-glow-cyan/20 ring-1 ring-cyan-500/40'
                    : isCompleted
                    ? 'bg-slate-900/60 border-emerald-500/40 text-slate-300'
                    : 'bg-slate-950/40 border-slate-800/60 text-slate-500 opacity-60'
                }`}
              >
                {/* Step Icon Badge */}
                <div
                  className={`w-7 h-7 md:w-9 md:h-9 rounded-lg flex items-center justify-center font-mono font-bold text-xs md:text-sm shrink-0 transition-colors ${
                    isCurrent
                      ? 'bg-cyan-500 text-slate-950 shadow-[0_0_10px_#06B6D4]'
                      : isCompleted
                      ? 'bg-emerald-500 text-slate-950'
                      : 'bg-slate-800 text-slate-400 border border-slate-700'
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-4 h-4 md:w-5 md:h-5 stroke-[3]" />
                  ) : (
                    <span>{step.number}</span>
                  )}
                </div>

                {/* Step Text Info */}
                <div className="flex flex-col min-w-0 text-center md:text-left">
                  <div className="flex items-center justify-center md:justify-start gap-1.5">
                    <span
                      className={`text-xs md:text-sm font-mono font-bold tracking-tight truncate ${
                        isCurrent
                          ? 'text-cyan-400'
                          : isCompleted
                          ? 'text-emerald-300'
                          : 'text-slate-400'
                      }`}
                    >
                      <span className="md:inline hidden">{step.label}</span>
                      <span className="md:hidden inline">{step.shortLabel}</span>
                    </span>
                  </div>

                  {counts ? (
                    <span className="text-[10px] md:text-xs font-mono text-slate-400">
                      {counts.confirmed} / {counts.total} Done
                    </span>
                  ) : (
                    <span className="text-[10px] md:text-xs font-mono text-slate-500">
                      {step.id === 'STAGE_4_READY' ? (workflow.isReady ? 'Verified' : 'Verification') : 'Machining'}
                    </span>
                  )}
                </div>

                {/* Active Indicator Top Light */}
                {isCurrent && (
                  <span className="absolute -top-1 left-1/2 -translate-x-1/2 w-8 h-1 bg-cyan-400 rounded-full shadow-[0_0_8px_#06B6D4]" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
