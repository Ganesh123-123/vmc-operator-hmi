export type StageName =
  | 'POWER_ON'
  | 'STAGE_1_CHECKS'
  | 'STAGE_2_TOOLS'
  | 'STAGE_3_WORKPIECE'
  | 'STAGE_4_READY'
  | 'STAGE_5_OPERATION';

export type ConfirmationStatus = 'PENDING' | 'CONFIRMED';
export type OperationStatus = 'READY' | 'RUNNING' | 'STOPPED';

export interface OperatorProfile {
  username: string;
  name: string;
  role: string;
  machineId: string;
  shift: string;
  token?: string;
}

export interface MachineInfo {
  id: string;
  name: string;
  type: string;
  status: string;
  powerStatus: string;
  operationName: string;
  material: string;
  quantity: number;
  drawingNumber: string;
  drawingRevision: string;
  cncProgram: string;
  programRevision: string;
  fixture: string;
  workOffset: string;
  dimensions: string;
  orientation: string;
}

export interface WorkflowSummary {
  machineChecksConfirmed: number;
  machineChecksTotal: number;
  toolsConfirmed: number;
  toolsTotal: number;
  workpieceConfirmed: number;
  workpieceTotal: number;
  allChecksComplete: boolean;
  allToolsComplete: boolean;
  allWorkpieceComplete: boolean;
  canProceedToNextStage: boolean;
}

export interface WorkflowProgress {
  currentStage: StageName;
  stageNumber: number;
  totalStages: number;
  activeItemIndex: number;
  isReady: boolean;
  operationStatus: OperationStatus;
  elapsedSeconds: number;
  summary: WorkflowSummary;
}

export interface MachineCheckItem {
  id: number;
  orderIndex: number;
  title: string;
  description: string;
  status: ConfirmationStatus;
  confirmedAt?: string | null;
  confirmedBy?: string;
}

export interface ToolItem {
  id: number;
  toolNumber: string;
  type: string;
  description: string;
  purpose: string;
  instruction: string;
  required: boolean;
  status: ConfirmationStatus;
  confirmedAt?: string | null;
}

export interface WorkpieceItem {
  id: number;
  orderIndex: number;
  title: string;
  instruction: string;
  detail?: string;
  status: ConfirmationStatus;
  confirmedAt?: string | null;
}

export interface ReadyCategoryItem {
  id: number | string;
  label: string;
  description?: string;
  status: ConfirmationStatus;
  confirmedAt?: string | null;
}

export interface ReadyCategory {
  title: string;
  items: ReadyCategoryItem[];
  isComplete: boolean;
}

export interface ReadyReviewData {
  isReady: boolean;
  canProceedToOperation: boolean;
  message: string;
  categories: {
    machineChecks: ReadyCategory;
    requiredTools: ReadyCategory;
    workpieceSetup: ReadyCategory;
  };
}

export interface OperationTelemetryData {
  status: OperationStatus;
  elapsedSeconds: number;
  program: string;
  revision: string;
  operationName: string;
  material: string;
  workOffset: string;
  machine: string;
  spindleRpm: number;
  feedRateMmMin: number;
  coolantStatus: 'ON' | 'OFF';
  currentTool: string;
  progressPercentage: number;
}

export interface LogEntry {
  id: string;
  level: string;
  stage: string;
  message: string;
  metadata?: string | null;
  createdAt: string;
}

export interface DashboardStats {
  machine: MachineInfo;
  workflow: WorkflowProgress;
  telemetry: OperationTelemetryData;
  oee: {
    score: number;
    availability: number;
    performance: number;
    quality: number;
  };
  sensors: {
    airPressureBar: number;
    lubePressureBar: number;
    coolantLevelPercent: number;
    spindleTempCelsius: number;
    spindleLoadPercent: number;
    axisPosition: {
      x: string;
      y: string;
      z: string;
    };
  };
  toolLife: {
    toolNumber: string;
    type: string;
    description: string;
    lifeRemainingPercent: number;
    cutMinutes: number;
    condition: string;
  }[];
  shift: {
    currentShift: string;
    operator: string;
    partsCompleted: number;
    shiftTarget: number;
    plannedCycleSeconds: number;
  };
  readinessSummary: {
    checksConfirmed: number;
    checksTotal: number;
    toolsConfirmed: number;
    toolsTotal: number;
    workpieceConfirmed: number;
    workpieceTotal: number;
  };
  recentLogs: LogEntry[];
}
