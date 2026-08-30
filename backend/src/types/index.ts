export type StageName = 
  | 'POWER_ON'
  | 'STAGE_1_CHECKS'
  | 'STAGE_2_TOOLS'
  | 'STAGE_3_WORKPIECE'
  | 'STAGE_4_READY'
  | 'STAGE_5_OPERATION';

export type ConfirmationStatus = 'PENDING' | 'CONFIRMED';
export type OperationStatus = 'READY' | 'RUNNING' | 'STOPPED';
export type MachineStatus = 'ONLINE' | 'RUNNING' | 'STOPPED' | 'ALARM' | 'MAINTENANCE';

export interface WorkflowProgressResponse {
  currentStage: StageName;
  stageNumber: number;
  totalStages: number;
  activeItemIndex: number;
  isReady: boolean;
  operationStatus: OperationStatus;
  elapsedSeconds: number;
  summary: {
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
  };
}

export interface ReadyReviewCategory {
  title: string;
  items: {
    id: number | string;
    label: string;
    description?: string;
    status: ConfirmationStatus;
    confirmedAt?: string | null;
  }[];
  isComplete: boolean;
}

export interface ReadyReviewResponse {
  isReady: boolean;
  canProceedToOperation: boolean;
  message: string;
  categories: {
    machineChecks: ReadyReviewCategory;
    requiredTools: ReadyReviewCategory;
    workpieceSetup: ReadyReviewCategory;
  };
}

export interface OperationTelemetry {
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
