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
  DashboardStats,
  LogEntry
} from '../types';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  try {
    const response = await fetch(`${API_BASE}${url}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers
      },
      ...options
    });

    const json = await response.json();

    if (!response.ok || json.success === false) {
      const errorMsg = json.error?.message || `HTTP Error ${response.status}: Failed request`;
      throw new Error(errorMsg);
    }

    return json.data !== undefined ? json.data : json;
  } catch (err: any) {
    console.error(`API Fetch Error [${url}]:`, err);
    throw err;
  }
}

export const api = {
  // Auth
  login: (username: string, password: string) =>
    fetchJson<OperatorProfile>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password })
    }),
  getMe: () => fetchJson<OperatorProfile>('/auth/me'),

  // Dashboard & Logs
  getDashboardStats: () => fetchJson<DashboardStats>('/dashboard/stats'),
  getLogs: () => fetchJson<LogEntry[]>('/logs'),

  // Machine & Workflow
  getMachine: () => fetchJson<MachineInfo>('/machine'),
  getWorkflow: () => fetchJson<WorkflowProgress>('/workflow'),
  nextStage: (targetStage?: StageName) =>
    fetchJson<{ success: boolean; currentStage: StageName; progress: WorkflowProgress }>('/workflow/next', {
      method: 'POST',
      body: JSON.stringify({ targetStage })
    }),
  resetWorkflow: () =>
    fetchJson<{ success: boolean; message: string; progress: WorkflowProgress }>('/workflow/reset', {
      method: 'POST'
    }),

  // Stage 1: Machine Checks
  getMachineChecks: () => fetchJson<MachineCheckItem[]>('/machine-checks'),
  confirmMachineCheck: (id: number, confirmedBy = 'operator') =>
    fetchJson<{ check: MachineCheckItem; allChecksConfirmed: boolean }>(`/machine-checks/${id}/confirm`, {
      method: 'POST',
      body: JSON.stringify({ confirmedBy })
    }),

  // Stage 2: Tools
  getTools: () => fetchJson<ToolItem[]>('/tools'),
  confirmTool: (id: number) =>
    fetchJson<{ tool: ToolItem; allToolsConfirmed: boolean }>(`/tools/${id}/confirm`, {
      method: 'POST'
    }),

  // Stage 3: Workpiece Setup
  getWorkpieceSetup: () => fetchJson<WorkpieceItem[]>('/workpiece'),
  confirmWorkpieceItem: (id: number) =>
    fetchJson<{ workpieceItem: WorkpieceItem; allWorkpieceConfirmed: boolean }>(`/workpiece/${id}/confirm`, {
      method: 'POST'
    }),

  // Stage 4: Ready Review
  getReadyReview: () => fetchJson<ReadyReviewData>('/ready-review'),

  // Stage 5: Operation
  getOperationTelemetry: () => fetchJson<OperationTelemetryData>('/operation'),
  startOperation: () =>
    fetchJson<{ success: boolean; message: string; telemetry: OperationTelemetryData }>('/operation/start', {
      method: 'POST'
    }),
  stopOperation: () =>
    fetchJson<{ success: boolean; message: string; telemetry: OperationTelemetryData }>('/operation/stop', {
      method: 'POST'
    })
};
