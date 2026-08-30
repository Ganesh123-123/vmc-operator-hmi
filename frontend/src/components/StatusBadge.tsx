import React from 'react';
import { CheckCircle2, Clock, Play, Square, AlertTriangle, ShieldCheck } from 'lucide-react';
import { ConfirmationStatus, OperationStatus } from '../types';

interface StatusBadgeProps {
  status: ConfirmationStatus | OperationStatus | string;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'md',
  showIcon = true
}) => {
  const normalized = status.toUpperCase();

  let colorClasses = 'bg-slate-800/80 text-slate-300 border-slate-700';
  let dotColor = 'bg-slate-400';
  let Icon = Clock;
  let pulse = false;

  switch (normalized) {
    case 'CONFIRMED':
    case 'ONLINE':
    case 'READY':
      colorClasses = 'bg-emerald-950/80 text-emerald-300 border-emerald-500/50 shadow-glow-green/20';
      dotColor = 'bg-emerald-400 shadow-[0_0_8px_#10B981]';
      Icon = normalized === 'CONFIRMED' ? CheckCircle2 : ShieldCheck;
      break;

    case 'RUNNING':
      colorClasses = 'bg-cyan-950/80 text-cyan-300 border-cyan-500 shadow-glow-cyan/30';
      dotColor = 'bg-cyan-400 shadow-[0_0_10px_#06B6D4]';
      Icon = Play;
      pulse = true;
      break;

    case 'PENDING':
      colorClasses = 'bg-amber-950/70 text-amber-300 border-amber-500/40';
      dotColor = 'bg-amber-400 shadow-[0_0_8px_#F59E0B]';
      Icon = Clock;
      break;

    case 'STOPPED':
      colorClasses = 'bg-red-950/80 text-red-300 border-red-500/50 shadow-glow-red/20';
      dotColor = 'bg-red-500 shadow-[0_0_8px_#EF4444]';
      Icon = Square;
      break;

    case 'ALARM':
    case 'ERROR':
      colorClasses = 'bg-red-950 text-red-200 border-red-600 shadow-glow-red/40';
      dotColor = 'bg-red-500 shadow-[0_0_12px_#EF4444]';
      Icon = AlertTriangle;
      pulse = true;
      break;

    default:
      break;
  }

  const sizeClasses = {
    sm: 'text-xs px-2.5 py-0.5 gap-1.5 font-medium',
    md: 'text-xs md:text-sm px-3.5 py-1.5 gap-2 font-semibold tracking-wider',
    lg: 'text-sm md:text-base px-5 py-2.5 gap-2.5 font-bold tracking-widest'
  }[size];

  return (
    <div
      className={`inline-flex items-center rounded-md border font-mono uppercase backdrop-blur-sm select-none ${colorClasses} ${sizeClasses}`}
    >
      <span className={`w-2 h-2 rounded-full ${dotColor} ${pulse ? 'animate-pulse-fast' : ''}`} />
      {showIcon && <Icon className="w-3.5 h-3.5 md:w-4 md:h-4 stroke-[2.5]" />}
      <span>{normalized}</span>
    </div>
  );
};
