import { prisma } from '../database/prisma';
import { AppError } from '../middleware/errorHandler';

export class ToolService {
  public static async getAllTools() {
    return prisma.tool.findMany({
      orderBy: { id: 'asc' }
    });
  }

  public static async getToolById(id: number) {
    const tool = await prisma.tool.findUnique({
      where: { id }
    });
    if (!tool) {
      throw new AppError(`Tool with ID ${id} not found.`, 404);
    }
    return tool;
  }

  public static async confirmTool(id: number) {
    const tool = await prisma.tool.findUnique({
      where: { id }
    });

    if (!tool) {
      throw new AppError(`Tool item #${id} does not exist.`, 404);
    }

    const updated = await prisma.tool.update({
      where: { id },
      data: {
        status: 'CONFIRMED',
        confirmedAt: new Date()
      }
    });

    await prisma.operationLog.create({
      data: {
        level: 'SUCCESS',
        stage: 'STAGE_2_TOOLS',
        message: `Tool ${tool.toolNumber} (${tool.description} - ${tool.purpose}) verified & confirmed installed.`
      }
    });

    const allTools = await prisma.tool.findMany();
    const allConfirmed = allTools.every((t) => t.status === 'CONFIRMED');

    const workflow = await prisma.workflowState.findUnique({ where: { id: 'CURRENT' } });
    if (workflow && workflow.currentStage === 'STAGE_2_TOOLS') {
      const nextIndex = Math.min(workflow.activeItemIndex + 1, allTools.length - 1);
      await prisma.workflowState.update({
        where: { id: 'CURRENT' },
        data: { activeItemIndex: nextIndex }
      });
    }

    return {
      tool: updated,
      allToolsConfirmed: allConfirmed
    };
  }
}
