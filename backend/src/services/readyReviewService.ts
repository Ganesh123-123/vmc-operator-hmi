import { prisma } from '../database/prisma';
import { ReadyReviewResponse } from '../types';

export class ReadyReviewService {
  public static async getReadyReview(): Promise<ReadyReviewResponse> {
    const [machineChecks, tools, workpieceItems] = await Promise.all([
      prisma.machineCheck.findMany({ orderBy: { orderIndex: 'asc' } }),
      prisma.tool.findMany({ orderBy: { id: 'asc' } }),
      prisma.workpieceSetup.findMany({ orderBy: { orderIndex: 'asc' } })
    ]);

    const checksComplete = machineChecks.length > 0 && machineChecks.every((c) => c.status === 'CONFIRMED');
    const toolsComplete = tools.length > 0 && tools.every((t) => t.status === 'CONFIRMED');
    const workpieceComplete = workpieceItems.length > 0 && workpieceItems.every((w) => w.status === 'CONFIRMED');

    const isReady = checksComplete && toolsComplete && workpieceComplete;

    // Synchronize isReady flag into workflow state
    await prisma.workflowState.update({
      where: { id: 'CURRENT' },
      data: { isReady }
    });

    let message = 'All startup checks, tool verifications, and workpiece setups are complete. Machine is READY for operation.';
    if (!checksComplete) {
      message = 'Stage 1 Machine Checks incomplete. Please confirm all 6 safety checks.';
    } else if (!toolsComplete) {
      message = 'Stage 2 Required Tools incomplete. Please confirm all 4 cutting tools.';
    } else if (!workpieceComplete) {
      message = 'Stage 3 Workpiece Setup incomplete. Please confirm all 6 workpiece setup steps.';
    }

    return {
      isReady,
      canProceedToOperation: isReady,
      message,
      categories: {
        machineChecks: {
          title: 'MACHINE CHECKS',
          items: machineChecks.map((c) => ({
            id: c.id,
            label: c.title,
            description: c.description,
            status: c.status as 'PENDING' | 'CONFIRMED',
            confirmedAt: c.confirmedAt?.toISOString() || null
          })),
          isComplete: checksComplete
        },
        requiredTools: {
          title: 'REQUIRED TOOLS',
          items: tools.map((t) => ({
            id: t.id,
            label: `${t.toolNumber} – ${t.description} (${t.purpose})`,
            description: t.instruction,
            status: t.status as 'PENDING' | 'CONFIRMED',
            confirmedAt: t.confirmedAt?.toISOString() || null
          })),
          isComplete: toolsComplete
        },
        workpieceSetup: {
          title: 'WORKPIECE SETUP',
          items: workpieceItems.map((w) => ({
            id: w.id,
            label: w.title,
            description: w.instruction,
            status: w.status as 'PENDING' | 'CONFIRMED',
            confirmedAt: w.confirmedAt?.toISOString() || null
          })),
          isComplete: workpieceComplete
        }
      }
    };
  }
}
