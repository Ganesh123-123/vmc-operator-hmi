import { prisma } from '../database/prisma';
import { AppError } from '../middleware/errorHandler';

export class MachineService {
  public static async getMachineDetails() {
    const machine = await prisma.machine.findUnique({
      where: { id: 'VMC-01' }
    });

    if (!machine) {
      throw new AppError('Machine configuration not found.', 404);
    }

    const workflow = await prisma.workflowState.findUnique({
      where: { id: 'CURRENT' }
    });

    return {
      ...machine,
      workflowState: workflow
    };
  }

  public static async updateMachineStatus(status: string) {
    return prisma.machine.update({
      where: { id: 'VMC-01' },
      data: { status }
    });
  }
}
