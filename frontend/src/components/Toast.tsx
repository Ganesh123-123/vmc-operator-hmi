import React from 'react';
import { AlertCircle, CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';
import { ToastState } from '../hooks/useWorkflow';

interface ToastProps {
  toast: ToastState | null;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ toast, onClose }) => {
  if (!toast) return null;

  const { message, type } = toast;

  let bgClass = 'bg-slate-900 border-slate-700 text-slate-200';
  let Icon = Info;
  let iconColor = 'text-cyan-400';

  if (type === 'success') {
    bgClass = 'bg-emerald-950/95 border-emerald-500/80 text-emerald-200 shadow-glow-green/30';
    Icon = CheckCircle2;
    iconColor = 'text-emerald-400';
  } else if (type === 'warn') {
    bgClass = 'bg-amber-950/95 border-amber-500/80 text-amber-200 shadow-glow-amber/30';
    Icon = AlertTriangle;
    iconColor = 'text-amber-400';
  } else if (type === 'error') {
    bgClass = 'bg-red-950/95 border-red-500/90 text-red-200 shadow-glow-red/40';
    Icon = AlertCircle;
    iconColor = 'text-red-400';
  }

  return (
    <div className="fixed top-20 right-4 md:right-8 z-50 max-w-md w-full animate-bounce-short">
      <div
        className={`flex items-start gap-3 p-4 rounded-xl border font-mono text-sm shadow-2xl backdrop-blur-md ${bgClass}`}
      >
        <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${iconColor}`} />
        <div className="flex-1 leading-snug tracking-wide font-medium">{message}</div>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white p-1 rounded transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
