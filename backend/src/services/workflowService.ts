import { prisma } from '../database/prisma';
import { AppError } from '../middleware/errorHandler';
import { StageName, WorkflowProgressResponse } from '../types';

export class WorkflowService {
  private static stageMapping: Record<StageName, number> = {
    POWER_ON: 0,
    STAGE_1_CHECKS: 1,
    STAGE_2_TOOLS: 2,
    STAGE_3_WORKPIECE: 3,
    STAGE_4_READY: 4,
    STAGE_5_OPERATION: 5
  };

  public static async getWorkflowProgress(): Promise<WorkflowProgressResponse> {
    const [workflow, machineChecks, tools, workpieceItems] = await Promise.all([
      prisma.workflowState.findUnique({ where: { id: 'CURRENT' } }),
      prisma.machineCheck.findMany(),
      prisma.tool.findMany(),
      prisma.workpieceSetup.findMany()
    ]);

    if (!workflow) {
      throw new AppError('Workflow state not found.', 500);
    }

    const checksConfirmed = machineChecks.filter((c) => c.status === 'CONFIRMED').length;
    const toolsConfirmed = tools.filter((t) => t.status === 'CONFIRMED').length;
    const workpieceConfirmed = workpieceItems.filter((w) => w.status === 'CONFIRMED').length;

    const allChecksComplete = machineChecks.length > 0 && checksConfirmed === machineChecks.length;
    const allToolsComplete = tools.length > 0 && toolsConfirmed === tools.length;
    const allWorkpieceComplete = workpieceItems.length > 0 && workpieceConfirmed === workpieceItems.length;

    const isReady = allChecksComplete && allToolsComplete && allWorkpieceComplete;

    let canProceedToNextStage = false;
    const currentStage = workflow.currentStage as StageName;

    if (currentStage === 'POWER_ON') {
      canProceedToNextStage = true;
    } else if (currentStage === 'STAGE_1_CHECKS') {
      canProceedToNextStage = allChecksComplete;
    } else if (currentStage === 'STAGE_2_TOOLS') {
      canProceedToNextStage = allToolsComplete;
    } else if (currentStage === 'STAGE_3_WORKPIECE') {
      canProceedToNextStage = allWorkpieceComplete;
    } else if (currentStage === 'STAGE_4_READY') {
      canProceedToNextStage = isReady;
    } else if (currentStage === 'STAGE_5_OPERATION') {
      canProceedToNextStage = false;
    }

    return {
      currentStage,
      stageNumber: this.stageMapping[currentStage] || 1,
      totalStages: 5,
      activeItemIndex: workflow.activeItemIndex,
      isReady,
      operationStatus: workflow.operationStatus as any,
      elapsedSeconds: workflow.elapsedSeconds,
      summary: {
        machineChecksConfirmed: checksConfirmed,
        machineChecksTotal: machineChecks.length,
        toolsConfirmed,
        toolsTotal: tools.length,
        workpieceConfirmed,
        workpieceTotal: workpieceItems.length,
        allChecksComplete,
        allToolsComplete,
        allWorkpieceComplete,
        canProceedToNextStage
      }
    };
  }

  public static async advanceWorkflowStage(targetStage?: StageName) {
    const progress = await this.getWorkflowProgress();
    const current = progress.currentStage;

    let nextStage: StageName;

    if (targetStage) {
      nextStage = targetStage;
    } else {
      if (current === 'POWER_ON') nextStage = 'STAGE_1_CHECKS';
      else if (current === 'STAGE_1_CHECKS') nextStage = 'STAGE_2_TOOLS';
      else if (current === 'STAGE_2_TOOLS') nextStage = 'STAGE_3_WORKPIECE';
      else if (current === 'STAGE_3_WORKPIECE') nextStage = 'STAGE_4_READY';
      else if (current === 'STAGE_4_READY') nextStage = 'STAGE_5_OPERATION';
      else nextStage = 'STAGE_5_OPERATION';
    }

    // Safety validations
    if (nextStage === 'STAGE_2_TOOLS' && !progress.summary.allChecksComplete) {
      throw new AppError('Complete all 6 machine checks before continuing to tools.', 400);
    }
    if (nextStage === 'STAGE_3_WORKPIECE' && (!progress.summary.allChecksComplete || !progress.summary.allToolsComplete)) {
      throw new AppError('Complete all machine checks and confirm all required tools before continuing.', 400);
    }
    if (nextStage === 'STAGE_4_READY' && (!progress.summary.allChecksComplete || !progress.summary.allToolsComplete || !progress.summary.allWorkpieceComplete)) {
      throw new AppError('Complete all setup stages before proceeding to Ready Review.', 400);
    }
    if (nextStage === 'STAGE_5_OPERATION' && !progress.isReady) {
      throw new AppError('Cannot proceed to operation: machine is not in READY state.', 400);
    }

    const updated = await prisma.workflowState.update({
      where: { id: 'CURRENT' },
      data: {
        currentStage: nextStage,
        activeItemIndex: 0
      }
    });

    await prisma.operationLog.create({
      data: {
        level: 'INFO',
        stage: nextStage,
        message: `Workflow advanced to ${nextStage}.`
      }
    });

    return {
      success: true,
      currentStage: updated.currentStage,
      progress: await this.getWorkflowProgress()
    };
  }

  public static async resetWorkflow() {
    await prisma.$transaction([
      prisma.machineCheck.updateMany({
        data: { status: 'PENDING', confirmedAt: null }
      }),
      prisma.tool.updateMany({
        data: { status: 'PENDING', confirmedAt: null }
      }),
      prisma.workpieceSetup.updateMany({
        data: { status: 'PENDING', confirmedAt: null }
      }),
      prisma.workflowState.update({
        where: { id: 'CURRENT' },
        data: {
          currentStage: 'STAGE_1_CHECKS',
          activeItemIndex: 0,
          isReady: false,
          operationStatus: 'READY',
          operationStartedAt: null,
          operationStoppedAt: null,
          elapsedSeconds: 0
        }
      }),
      prisma.machine.update({
        where: { id: 'VMC-01' },
        data: { status: 'ONLINE' }
      }),
      prisma.operationLog.create({
        data: {
          level: 'WARN',
          stage: 'STAGE_1_CHECKS',
          message: 'Workflow reset by operator. Returned to Stage 1: Machine Checks.'
        }
      })
    ]);

    return {
      success: true,
      message: 'Workflow reset successfully. Returned to Stage 1 – Machine Checks.',
      progress: await this.getWorkflowProgress()
    };
  }
}
