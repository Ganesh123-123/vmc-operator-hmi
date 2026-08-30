import { useState, useEffect, useCallback, useRef } from 'react';
import { api } from '../services/api';
import {
  MachineInfo,
  WorkflowProgress,
  MachineCheckItem,
  ToolItem,
  WorkpieceItem,
  ReadyReviewData,
  OperationTelemetryData,
  StageName,
  OperatorProfile,
  DashboardStats
} from '../types';

export interface ToastState {
  message: string;
  type: 'info' | 'success' | 'warn' | 'error';
}

const AUTH_STORAGE_KEY = 'vmc_hmi_operator_session';

export function useWorkflow() {
  const [operator, setOperator] = useState<OperatorProfile | null>(() => {
    try {
      const saved = localStorage.getItem(AUTH_STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [activeView, setActiveView] = useState<'hmi' | 'dashboard'>('hmi');
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);

  const [machine, setMachine] = useState<MachineInfo | null>(null);
  const [workflow, setWorkflow] = useState<WorkflowProgress | null>(null);
  const [machineChecks, setMachineChecks] = useState<MachineCheckItem[]>([]);
  const [tools, setTools] = useState<ToolItem[]>([]);
  const [workpieceItems, setWorkpieceItems] = useState<WorkpieceItem[]>([]);
  const [readyReview, setReadyReview] = useState<ReadyReviewData | null>(null);
  const [telemetry, setTelemetry] = useState<OperationTelemetryData | null>(null);

  const [loading, setLoading] = useState<boolean>(true);
  const [actionLoading, setActionLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<ToastState | null>(null);

  const toastTimerRef = useRef<NodeJS.Timeout | null>(null);

  const showToast = useCallback((message: string, type: ToastState['type'] = 'info') => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToast({ message, type });
    toastTimerRef.current = setTimeout(() => {
      setToast(null);
    }, 4500);
  }, []);

  const refreshAll = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    setError(null);
    try {
      const [m, w, c, t, wp, r, tel, stats] = await Promise.all([
        api.getMachine(),
        api.getWorkflow(),
        api.getMachineChecks(),
        api.getTools(),
        api.getWorkpieceSetup(),
        api.getReadyReview(),
        api.getOperationTelemetry(),
        api.getDashboardStats()
      ]);

      setMachine(m);
      setWorkflow(w);
      setMachineChecks(c);
      setTools(t);
      setWorkpieceItems(wp);
      setReadyReview(r);
      setTelemetry(tel);
      setDashboardStats(stats);
    } catch (err: any) {
      setError(err.message || 'Failed to connect to VMC HMI backend.');
      showToast(err.message || 'Backend connection error', 'error');
    } finally {
      if (!silent) setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    if (operator) {
      refreshAll();
    } else {
      setLoading(false);
    }
  }, [operator, refreshAll]);

  // Polling interval when in RUNNING state or viewing Dashboard
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (operator && (workflow?.operationStatus === 'RUNNING' || activeView === 'dashboard')) {
      interval = setInterval(async () => {
        try {
          const [tel, stats] = await Promise.all([
            api.getOperationTelemetry(),
            api.getDashboardStats()
          ]);
          setTelemetry(tel);
          setDashboardStats(stats);

          if (tel.status !== workflow?.operationStatus) {
            const w = await api.getWorkflow();
            setWorkflow(w);
          }
        } catch {
          // Silent background poll error catch
        }
      }, 1500);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [operator, workflow?.operationStatus, activeView]);

  // Login
  const login = async (username: string, pass: string) => {
    setActionLoading(true);
    setError(null);
    try {
      const user = await api.login(username, pass);
      setOperator(user);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
      showToast(`Welcome back, ${user.name}!`, 'success');
      await refreshAll(false);
    } catch (err: any) {
      setError(err.message);
      showToast(err.message, 'error');
      throw err;
    } finally {
      setActionLoading(false);
    }
  };

  // Logout
  const logout = () => {
    setOperator(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
    showToast('Logged out of VMC HMI terminal.', 'info');
  };

  // Confirm Machine Check
  const confirmMachineCheck = async (id: number) => {
    setActionLoading(true);
    try {
      const res = await api.confirmMachineCheck(id, operator?.username || 'operator');
      setMachineChecks((prev) =>
        prev.map((item) => (item.id === id ? res.check : item))
      );
      showToast(`Machine check confirmed.`, 'success');
      await refreshAll(true);
    } catch (err: any) {
      showToast(err.message, 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // Confirm Tool
  const confirmTool = async (id: number) => {
    setActionLoading(true);
    try {
      const res = await api.confirmTool(id);
      setTools((prev) =>
        prev.map((item) => (item.id === id ? res.tool : item))
      );
      showToast(`Tool ${res.tool.toolNumber} confirmed installed.`, 'success');
      await refreshAll(true);
    } catch (err: any) {
      showToast(err.message, 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // Confirm Workpiece item
  const confirmWorkpieceItem = async (id: number) => {
    setActionLoading(true);
    try {
      const res = await api.confirmWorkpieceItem(id);
      setWorkpieceItems((prev) =>
        prev.map((item) => (item.id === id ? res.workpieceItem : item))
      );
      showToast(`Workpiece setup step #${id} confirmed.`, 'success');
      await refreshAll(true);
    } catch (err: any) {
      showToast(err.message, 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // Advance Stage
  const nextStage = async (targetStage?: StageName) => {
    setActionLoading(true);
    try {
      const res = await api.nextStage(targetStage);
      setWorkflow(res.progress);
      showToast(`Advanced to ${res.progress.currentStage.replace(/_/g, ' ')}`, 'info');
      await refreshAll(true);
    } catch (err: any) {
      showToast(err.message, 'warn');
    } finally {
      setActionLoading(false);
    }
  };

  // Start Operation
  const startOperation = async () => {
    setActionLoading(true);
    try {
      const res = await api.startOperation();
      setTelemetry(res.telemetry);
      showToast('Operation started! Spindle running.', 'success');
      await refreshAll(true);
    } catch (err: any) {
      showToast(err.message, 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // Stop Operation
  const stopOperation = async () => {
    setActionLoading(true);
    try {
      const res = await api.stopOperation();
      setTelemetry(res.telemetry);
      showToast('Operation stopped safely.', 'warn');
      await refreshAll(true);
    } catch (err: any) {
      showToast(err.message, 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // Reset Workflow
  const resetWorkflow = async () => {
    setActionLoading(true);
    try {
      const res = await api.resetWorkflow();
      setWorkflow(res.progress);
      showToast('Workflow reset to Stage 1 – Machine Checks.', 'info');
      await refreshAll(true);
    } catch (err: any) {
      showToast(err.message, 'error');
    } finally {
      setActionLoading(false);
    }
  };

  return {
    operator,
    activeView,
    setActiveView,
    dashboardStats,
    machine,
    workflow,
    machineChecks,
    tools,
    workpieceItems,
    readyReview,
    telemetry,
    loading,
    actionLoading,
    error,
    toast,
    login,
    logout,
    showToast,
    refreshAll,
    confirmMachineCheck,
    confirmTool,
    confirmWorkpieceItem,
    nextStage,
    startOperation,
    stopOperation,
    resetWorkflow
  };
}
