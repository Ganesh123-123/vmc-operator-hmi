import { prisma } from '../database/prisma';
import { AppError } from '../middleware/errorHandler';

export class MachineCheckService {
  public static async getAllChecks() {
    return prisma.machineCheck.findMany({
      orderBy: { orderIndex: 'asc' }
    });
  }

  public static async getCheckById(id: number) {
    const check = await prisma.machineCheck.findUnique({
      where: { id }
    });
    if (!check) {
      throw new AppError(`Machine check with ID ${id} not found.`, 404);
    }
    return check;
  }

  public static async confirmCheck(id: number, confirmedBy = 'operator') {
    const check = await prisma.machineCheck.findUnique({
      where: { id }
    });

    if (!check) {
      throw new AppError(`Machine check item #${id} does not exist.`, 404);
    }

    // Update check confirmation
    const updated = await prisma.machineCheck.update({
      where: { id },
      data: {
        status: 'CONFIRMED',
        confirmedAt: new Date(),
        confirmedBy
      }
    });

    // Log event
    await prisma.operationLog.create({
      data: {
        level: 'SUCCESS',
        stage: 'STAGE_1_CHECKS',
        message: `Machine Check #${check.orderIndex} "${check.title}" confirmed by ${confirmedBy}.`
      }
    });

    // Recalculate workflow state readiness
    const allChecks = await prisma.machineCheck.findMany();
    const allConfirmed = allChecks.every((c) => c.status === 'CONFIRMED');

    // Auto-advance active item index if appropriate
    const workflow = await prisma.workflowState.findUnique({ where: { id: 'CURRENT' } });
    if (workflow && workflow.currentStage === 'STAGE_1_CHECKS') {
      const nextIndex = Math.min(workflow.activeItemIndex + 1, allChecks.length - 1);
      await prisma.workflowState.update({
        where: { id: 'CURRENT' },
        data: { activeItemIndex: nextIndex }
      });
    }

    return {
      check: updated,
      allChecksConfirmed: allConfirmed
    };
  }
}
