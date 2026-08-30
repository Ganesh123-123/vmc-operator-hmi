import React from 'react';
import {
  Activity,
  Gauge,
  Droplets,
  Wind,
  Layers,
  Wrench,
  Clock,
  ArrowRight,
  ShieldCheck,
  FileCode,
  Crosshair,
  TrendingUp,
  Cpu,
  History
} from 'lucide-react';
import { DashboardStats, WorkflowProgress } from '../types';
import { StatusBadge } from './StatusBadge';

interface DashboardViewProps {
  stats: DashboardStats | null;
  workflow: WorkflowProgress | null;
  onGoToHmi: () => void;
  loading: boolean;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  stats,
  workflow,
  onGoToHmi
}) => {
  if (!stats) {
    return (
      <div className="p-12 text-center font-mono text-slate-400">
        Loading machine telemetry dashboard...
      </div>
    );
  }

  const oee = stats.oee;
  const sensors = stats.sensors;
  const machine = stats.machine;

  return (
    <div className="flex-1 flex flex-col max-w-7xl mx-auto w-full p-4 md:p-6 gap-6">
      
      {/* Dashboard Top Row: Title + HMI Switcher CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-cyan-950/60 border border-cyan-800/40 text-cyan-400 font-mono text-xs font-bold uppercase tracking-wider mb-1">
            MACHINE FLEET OVERVIEW • VMC-01
          </div>
          <h2 className="text-2xl md:text-3xl font-mono font-bold text-white tracking-tight">
            Industrial Telemetry Dashboard
          </h2>
        </div>

        <button
          onClick={onGoToHmi}
          className="px-6 py-3.5 rounded-xl font-mono text-sm font-bold bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 shadow-glow-cyan/30 flex items-center justify-center gap-2.5 transition-all btn-tactile cursor-pointer uppercase tracking-wider"
        >
          <Wrench className="w-4 h-4" />
          <span>OPEN HMI OPERATOR GUIDANCE</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* 4 Top KPI Cards (OEE, Availability, Performance, Quality) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-slate-900/90 border border-slate-800 p-4.5 rounded-2xl shadow-xl font-mono">
          <div className="flex items-center justify-between text-slate-400 text-xs uppercase mb-1">
            <span>OVERALL OEE</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl md:text-3xl font-bold text-emerald-400">{oee.score}%</div>
          <div className="mt-2 text-[11px] text-slate-400 flex items-center justify-between">
            <span>TARGET: 85.0%</span>
            <span className="text-emerald-300 font-semibold">+3.5% ABOVE</span>
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-4.5 rounded-2xl shadow-xl font-mono">
          <div className="flex items-center justify-between text-slate-400 text-xs uppercase mb-1">
            <span>AVAILABILITY</span>
            <Activity className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl md:text-3xl font-bold text-cyan-300">{oee.availability}%</div>
          <div className="mt-2 text-[11px] text-slate-400 flex items-center justify-between">
            <span>UPTIME SHIFT A</span>
            <span className="text-cyan-300 font-semibold">99.2%</span>
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-4.5 rounded-2xl shadow-xl font-mono">
          <div className="flex items-center justify-between text-slate-400 text-xs uppercase mb-1">
            <span>PERFORMANCE</span>
            <Gauge className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl md:text-3xl font-bold text-amber-300">{oee.performance}%</div>
          <div className="mt-2 text-[11px] text-slate-400 flex items-center justify-between">
            <span>SPEED EFFICIENCY</span>
            <span className="text-amber-300 font-semibold">OPTIMAL</span>
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-4.5 rounded-2xl shadow-xl font-mono">
          <div className="flex items-center justify-between text-slate-400 text-xs uppercase mb-1">
            <span>QUALITY YIELD</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl md:text-3xl font-bold text-emerald-300">{oee.quality}%</div>
          <div className="mt-2 text-[11px] text-slate-400 flex items-center justify-between">
            <span>DEFECT RATE</span>
            <span className="text-emerald-300 font-semibold">0.00%</span>
          </div>
        </div>

      </div>

      {/* Middle Section: Active Job Blueprint + Sensor Gauges */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Active Machining Scenario Specification Card (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 p-5 md:p-6 rounded-2xl shadow-xl font-mono flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <div className="flex items-center gap-2 text-cyan-300 font-bold text-sm">
                <FileCode className="w-4 h-4 text-cyan-400" />
                <span>ACTIVE MACHINING SPECIFICATION</span>
              </div>
              <StatusBadge status={workflow?.operationStatus || 'READY'} size="sm" />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs mb-4">
              <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800">
                <span className="text-slate-500">MACHINE</span>
                <div className="font-bold text-slate-200 mt-1">{machine.name} (3-Axis)</div>
              </div>
              <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800">
                <span className="text-slate-500">OPERATION</span>
                <div className="font-bold text-cyan-300 mt-1">{machine.operationName}</div>
              </div>
              <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800">
                <span className="text-slate-500">CNC PROGRAM</span>
                <div className="font-bold text-slate-200 mt-1">{machine.cncProgram}</div>
              </div>
              <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800">
                <span className="text-slate-500">DRAWING & REV</span>
                <div className="font-bold text-cyan-400 mt-1">{machine.drawingNumber} {machine.drawingRevision}</div>
              </div>
              <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800">
                <span className="text-slate-500">WORK OFFSET</span>
                <div className="font-bold text-amber-400 mt-1">{machine.workOffset}</div>
              </div>
              <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800">
                <span className="text-slate-500">FIXTURE</span>
                <div className="font-bold text-slate-200 mt-1 truncate">Vice FV-100</div>
              </div>
            </div>

            {/* Workpiece dimensions & orientation */}
            <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800 text-xs">
              <div className="flex items-center gap-2 text-slate-400 font-bold mb-1.5">
                <Layers className="w-3.5 h-3.5 text-cyan-400" />
                <span>STOCK & DATUM SPECIFICATION</span>
              </div>
              <div className="text-slate-300 leading-relaxed">
                Material: <strong className="text-white">{machine.material}</strong> • Dimensions: <strong className="text-white">{machine.dimensions}</strong>
              </div>
              <div className="text-cyan-300/80 mt-1 text-[11px]">
                {machine.orientation}
              </div>
            </div>
          </div>

          {/* Workflow Readiness Progress Bar */}
          <div className="mt-5 pt-4 border-t border-slate-800 text-xs">
            <div className="flex justify-between text-slate-400 mb-1.5">
              <span>HMI STARTUP SETUP COMPLETION</span>
              <span className="text-emerald-400 font-bold">
                {stats.readinessSummary.checksConfirmed + stats.readinessSummary.toolsConfirmed + stats.readinessSummary.workpieceConfirmed} / {stats.readinessSummary.checksTotal + stats.readinessSummary.toolsTotal + stats.readinessSummary.workpieceTotal} Verified
              </span>
            </div>
            <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 transition-all duration-300"
                style={{
                  width: `${
                    ((stats.readinessSummary.checksConfirmed + stats.readinessSummary.toolsConfirmed + stats.readinessSummary.workpieceConfirmed) /
                      (stats.readinessSummary.checksTotal + stats.readinessSummary.toolsTotal + stats.readinessSummary.workpieceTotal)) *
                    100
                  }%`
                }}
              />
            </div>
          </div>
        </div>

        {/* Sensor & Pneumatics Telemetry (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 p-5 md:p-6 rounded-2xl shadow-xl font-mono">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
            <div className="flex items-center gap-2 text-cyan-300 font-bold text-sm">
              <Gauge className="w-4 h-4 text-cyan-400" />
              <span>SENSOR & PNEUMATIC TELEMETRY</span>
            </div>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </div>

          <div className="space-y-3 text-xs">
            
            {/* Air Pressure */}
            <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 flex items-center justify-between">
              <span className="text-slate-400 flex items-center gap-2">
                <Wind className="w-3.5 h-3.5 text-cyan-400" />
                MAIN AIR PRESSURE
              </span>
              <span className="font-bold text-sm text-cyan-300">{sensors.airPressureBar} bar</span>
            </div>

            {/* Lube Pressure */}
            <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 flex items-center justify-between">
              <span className="text-slate-400 flex items-center gap-2">
                <Droplets className="w-3.5 h-3.5 text-amber-400" />
                LUBE SYSTEM PRESSURE
              </span>
              <span className="font-bold text-sm text-amber-300">{sensors.lubePressureBar} bar</span>
            </div>

            {/* Coolant Tank */}
            <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 flex items-center justify-between">
              <span className="text-slate-400 flex items-center gap-2">
                <Droplets className="w-3.5 h-3.5 text-emerald-400" />
                FLOOD COOLANT LEVEL
              </span>
              <span className="font-bold text-sm text-emerald-300">{sensors.coolantLevelPercent}%</span>
            </div>

            {/* Spindle Temp */}
            <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 flex items-center justify-between">
              <span className="text-slate-400 flex items-center gap-2">
                <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                SPINDLE MOTOR TEMP
              </span>
              <span className="font-bold text-sm text-slate-200">{sensors.spindleTempCelsius} °C</span>
            </div>

            {/* Axis Datum Probes */}
            <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 flex items-center justify-between">
              <span className="text-slate-400 flex items-center gap-2">
                <Crosshair className="w-3.5 h-3.5 text-cyan-400" />
                AXIS HOME POS (X, Y, Z)
              </span>
              <span className="font-bold text-xs text-cyan-300">0.000 / 0.000 / 0.000</span>
            </div>

          </div>
        </div>

      </div>

      {/* Bottom Section: Tool Life Wear Monitor + Real-Time Audit Log Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Tool Life Wear Monitor (6 cols) */}
        <div className="lg:col-span-6 bg-slate-900/90 border border-slate-800 p-5 md:p-6 rounded-2xl shadow-xl font-mono">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
            <div className="flex items-center gap-2 text-cyan-300 font-bold text-sm">
              <Wrench className="w-4 h-4 text-cyan-400" />
              <span>CUTTING TOOL WEAR & MAGAZINE (4 TOOLS)</span>
            </div>
          </div>

          <div className="space-y-3 font-mono text-xs">
            {stats.toolLife.map((tool) => (
              <div
                key={tool.toolNumber}
                className="p-3 bg-slate-950/70 rounded-xl border border-slate-800 flex flex-col gap-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 font-bold">
                      {tool.toolNumber}
                    </span>
                    <span className="font-bold text-slate-200">{tool.description}</span>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    tool.lifeRemainingPercent > 80 ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-amber-950 text-amber-300 border border-amber-800'
                  }`}>
                    {tool.condition}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-slate-400 text-[11px]">
                  <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${
                        tool.lifeRemainingPercent > 80 ? 'bg-emerald-500' : 'bg-amber-500'
                      }`}
                      style={{ width: `${tool.lifeRemainingPercent}%` }}
                    />
                  </div>
                  <span className="font-bold text-slate-200 shrink-0">{tool.lifeRemainingPercent}%</span>
                  <span className="shrink-0 text-slate-500">({tool.cutMinutes}m cut)</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Real-Time Event Audit Log Feed (6 cols) */}
        <div className="lg:col-span-6 bg-slate-900/90 border border-slate-800 p-5 md:p-6 rounded-2xl shadow-xl font-mono flex flex-col">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
            <div className="flex items-center gap-2 text-cyan-300 font-bold text-sm">
              <History className="w-4 h-4 text-cyan-400" />
              <span>LIVE OPERATION AUDIT LOGS</span>
            </div>
            <span className="text-[11px] text-slate-500">PERSISTENT IN SQLITE</span>
          </div>

          <div className="space-y-2 overflow-y-auto max-h-72 pr-1 text-xs">
            {stats.recentLogs.map((log) => (
              <div
                key={log.id}
                className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80 flex items-start gap-2.5"
              >
                <Clock className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-slate-300 truncate">{log.message}</span>
                    <span className="text-[10px] text-slate-500 shrink-0">
                      {new Date(log.createdAt).toLocaleTimeString()}
                    </span>
                  </div>
                  <div className="text-[10px] text-cyan-400/80 mt-0.5">{log.stage}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
