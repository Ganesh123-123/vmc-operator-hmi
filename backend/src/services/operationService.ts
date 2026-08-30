import { prisma } from '../database/prisma';
import { AppError } from '../middleware/errorHandler';
import { ReadyReviewService } from './readyReviewService';
import { OperationTelemetry } from '../types';

export class OperationService {
  public static async getOperationTelemetry(): Promise<OperationTelemetry> {
    const [workflow, machine] = await Promise.all([
      prisma.workflowState.findUnique({ where: { id: 'CURRENT' } }),
      prisma.machine.findUnique({ where: { id: 'VMC-01' } })
    ]);

    if (!workflow || !machine) {
      throw new AppError('Machine or workflow state not initialized.', 500);
    }

    let elapsed = workflow.elapsedSeconds;
    if (workflow.operationStatus === 'RUNNING' && workflow.operationStartedAt) {
      const now = new Date().getTime();
      const started = new Date(workflow.operationStartedAt).getTime();
      const currentRunSeconds = Math.floor((now - started) / 1000);
      elapsed += currentRunSeconds;
    }

    // Simulate realistic machining progress (e.g. 180 seconds total pocket milling cycle)
    const cycleTotalSeconds = 180;
    const progress = Math.min(100, Math.floor((elapsed / cycleTotalSeconds) * 100));

    // Determine current active tool in cycle
    let currentTool = 'T01 - 50mm Face Mill (Facing)';
    if (progress > 25 && progress <= 65) {
      currentTool = 'T02 - 10mm Carbide End Mill (Pocketing)';
    } else if (progress > 65 && progress <= 85) {
      currentTool = 'T03 - 6mm Carbide Drill (Drilling)';
    } else if (progress > 85) {
      currentTool = 'T04 - 8mm Ball Nose End Mill (Finishing)';
    }

    return {
      status: workflow.operationStatus as 'READY' | 'RUNNING' | 'STOPPED',
      elapsedSeconds: elapsed,
      program: machine.cncProgram,
      revision: machine.programRevision,
      operationName: machine.operationName,
      material: machine.material,
      workOffset: machine.workOffset,
      machine: machine.name,
      spindleRpm: workflow.operationStatus === 'RUNNING' ? workflow.spindleRpm : 0,
      feedRateMmMin: workflow.operationStatus === 'RUNNING' ? 800 : 0,
      coolantStatus: workflow.operationStatus === 'RUNNING' ? 'ON' : 'OFF',
      currentTool,
      progressPercentage: progress
    };
  }

  public static async startOperation() {
    // 1. Verify that all setup stages are 100% complete
    const readyState = await ReadyReviewService.getReadyReview();
    if (!readyState.isReady) {
      throw new AppError('Cannot start operation: All Machine Checks, Required Tools, and Workpiece Setup items must be confirmed first.', 400);
    }

    const workflow = await prisma.workflowState.findUnique({ where: { id: 'CURRENT' } });
    if (!workflow) {
      throw new AppError('Workflow not found.', 500);
    }

    if (workflow.operationStatus === 'RUNNING') {
      return {
        message: 'Operation is already running.',
        telemetry: await this.getOperationTelemetry()
      };
    }

    const now = new Date();
    await prisma.workflowState.update({
      where: { id: 'CURRENT' },
      data: {
        currentStage: 'STAGE_5_OPERATION',
        operationStatus: 'RUNNING',
        operationStartedAt: now,
        updatedAt: now
      }
    });

    await prisma.machine.update({
      where: { id: 'VMC-01' },
      data: { status: 'RUNNING' }
    });

    await prisma.operationSession.create({
      data: {
        operationName: 'Pocket Milling',
        programName: 'PRF_VMC_POCKET_001',
        revision: 'REV-B',
        status: 'RUNNING',
        startedAt: now,
        operator: 'operator'
      }
    });

    await prisma.operationLog.create({
      data: {
        level: 'SUCCESS',
        stage: 'STAGE_5_OPERATION',
        message: 'Spindle engaged. PRF_VMC_POCKET_001 REV-B started at G54.'
      }
    });

    return {
      success: true,
      message: 'Operation started successfully. Machining cycle in progress.',
      telemetry: await this.getOperationTelemetry()
    };
  }

  public static async stopOperation() {
    const workflow = await prisma.workflowState.findUnique({ where: { id: 'CURRENT' } });
    if (!workflow) {
      throw new AppError('Workflow not found.', 500);
    }

    if (workflow.operationStatus === 'STOPPED') {
      return {
        message: 'Operation is already stopped.',
        telemetry: await this.getOperationTelemetry()
      };
    }

    const now = new Date();
    let additionalSeconds = 0;
    if (workflow.operationStartedAt) {
      additionalSeconds = Math.floor((now.getTime() - new Date(workflow.operationStartedAt).getTime()) / 1000);
    }

    const totalElapsed = workflow.elapsedSeconds + additionalSeconds;

    await prisma.workflowState.update({
      where: { id: 'CURRENT' },
      data: {
        operationStatus: 'STOPPED',
        operationStoppedAt: now,
        operationStartedAt: null,
        elapsedSeconds: totalElapsed,
        updatedAt: now
      }
    });

    await prisma.machine.update({
      where: { id: 'VMC-01' },
      data: { status: 'STOPPED' }
    });

    await prisma.operationLog.create({
      data: {
        level: 'ALERT',
        stage: 'STAGE_5_OPERATION',
        message: `Operation halted by operator. Total elapsed time: ${totalElapsed}s.`
      }
    });

    return {
      success: true,
      message: 'Operation stopped safely. Spindle and feed axes halted.',
      telemetry: await this.getOperationTelemetry()
    };
  }
}
