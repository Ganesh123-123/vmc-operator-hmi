import { Request, Response, NextFunction } from 'express';
import { prisma } from '../database/prisma';
import { OperationService } from '../services/operationService';

export class DashboardController {
  public static async getStats(_req: Request, res: Response, next: NextFunction) {
    try {
      const [machine, workflow, checks, tools, workpieceItems, logs] = await Promise.all([
        prisma.machine.findUnique({ where: { id: 'VMC-01' } }),
        prisma.workflowState.findUnique({ where: { id: 'CURRENT' } }),
        prisma.machineCheck.findMany(),
        prisma.tool.findMany(),
        prisma.workpieceSetup.findMany(),
        prisma.operationLog.findMany({
          take: 12,
          orderBy: { createdAt: 'desc' }
        })
      ]);

      const telemetry = await OperationService.getOperationTelemetry();

      const stats = {
        machine: machine,
        workflow: workflow,
        telemetry: telemetry,
        oee: {
          score: 88.5,
          availability: 99.2,
          performance: 94.8,
          quality: 100.0
        },
        sensors: {
          airPressureBar: 6.0,
          lubePressureBar: 3.2,
          coolantLevelPercent: 94,
          spindleTempCelsius: workflow?.operationStatus === 'RUNNING' ? 34.2 : 26.8,
          spindleLoadPercent: workflow?.operationStatus === 'RUNNING' ? 24 : 0,
          axisPosition: {
            x: '0.000 mm',
            y: '0.000 mm',
            z: '0.000 mm'
          }
        },
        toolLife: [
          { toolNumber: 'T01', type: 'Face Mill', description: '50 mm Face Mill', lifeRemainingPercent: 92, cutMinutes: 42, condition: 'GOOD' },
          { toolNumber: 'T02', type: 'End Mill', description: '10 mm Carbide End Mill', lifeRemainingPercent: 85, cutMinutes: 68, condition: 'GOOD' },
          { toolNumber: 'T03', type: 'Drill', description: '6 mm Carbide Drill', lifeRemainingPercent: 96, cutMinutes: 14, condition: 'EXCELLENT' },
          { toolNumber: 'T04', type: 'Ball Nose', description: '8 mm Ball Nose End Mill', lifeRemainingPercent: 78, cutMinutes: 89, condition: 'FAIR' }
        ],
        shift: {
          currentShift: 'Shift A (06:00 - 14:00)',
          operator: 'operator',
          partsCompleted: workflow?.operationStatus === 'RUNNING' || workflow?.operationStatus === 'STOPPED' ? 1 : 0,
          shiftTarget: 10,
          plannedCycleSeconds: 180
        },
        readinessSummary: {
          checksConfirmed: checks.filter((c) => c.status === 'CONFIRMED').length,
          checksTotal: checks.length,
          toolsConfirmed: tools.filter((t) => t.status === 'CONFIRMED').length,
          toolsTotal: tools.length,
          workpieceConfirmed: workpieceItems.filter((w) => w.status === 'CONFIRMED').length,
          workpieceTotal: workpieceItems.length
        },
        recentLogs: logs
      };

      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      next(error);
    }
  }
}
