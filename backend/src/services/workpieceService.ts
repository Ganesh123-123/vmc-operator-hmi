import { prisma } from '../database/prisma';
import { AppError } from '../middleware/errorHandler';

export class WorkpieceService {
  public static async getAllWorkpieceItems() {
    return prisma.workpieceSetup.findMany({
      orderBy: { orderIndex: 'asc' }
    });
  }

  public static async getWorkpieceItemById(id: number) {
    const item = await prisma.workpieceSetup.findUnique({
      where: { id }
    });
    if (!item) {
      throw new AppError(`Workpiece setup step #${id} not found.`, 404);
    }
    return item;
  }

  public static async confirmWorkpieceItem(id: number) {
    const item = await prisma.workpieceSetup.findUnique({
      where: { id }
    });

    if (!item) {
      throw new AppError(`Workpiece setup step #${id} does not exist.`, 404);
    }

    const updated = await prisma.workpieceSetup.update({
      where: { id },
      data: {
        status: 'CONFIRMED',
        confirmedAt: new Date()
      }
    });

    await prisma.operationLog.create({
      data: {
        level: 'SUCCESS',
        stage: 'STAGE_3_WORKPIECE',
        message: `Workpiece setup step #${item.orderIndex} "${item.title}" confirmed.`
      }
    });

    const allItems = await prisma.workpieceSetup.findMany();
    const allConfirmed = allItems.every((i) => i.status === 'CONFIRMED');

    const workflow = await prisma.workflowState.findUnique({ where: { id: 'CURRENT' } });
    if (workflow && workflow.currentStage === 'STAGE_3_WORKPIECE') {
      const nextIndex = Math.min(workflow.activeItemIndex + 1, allItems.length - 1);
      await prisma.workflowState.update({
        where: { id: 'CURRENT' },
        data: { activeItemIndex: nextIndex }
      });
    }

    return {
      workpieceItem: updated,
      allWorkpieceConfirmed: allConfirmed
    };
  }
}
