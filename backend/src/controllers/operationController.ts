import { Request, Response, NextFunction } from 'express';
import { OperationService } from '../services/operationService';

export class OperationController {
  public static async getTelemetry(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await OperationService.getOperationTelemetry();
      res.json({
        success: true,
        data
      });
    } catch (error) {
      next(error);
    }
  }

  public static async start(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await OperationService.startOperation();
      res.json({
        success: true,
        data
      });
    } catch (error) {
      next(error);
    }
  }

  public static async stop(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await OperationService.stopOperation();
      res.json({
        success: true,
        data
      });
    } catch (error) {
      next(error);
    }
  }
}
