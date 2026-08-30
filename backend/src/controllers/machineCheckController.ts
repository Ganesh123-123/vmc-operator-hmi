import { Request, Response, NextFunction } from 'express';
import { MachineCheckService } from '../services/machineCheckService';

export class MachineCheckController {
  public static async getAll(_req: Request, res: Response, next: NextFunction) {
    try {
      const data = await MachineCheckService.getAllChecks();
      res.json({
        success: true,
        data
      });
    } catch (error) {
      next(error);
    }
  }

  public static async confirm(req: Request, res: Response, next: NextFunction) {
    try {
      const idParam = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const id = parseInt(idParam, 10);
      const { confirmedBy } = req.body;
      const data = await MachineCheckService.confirmCheck(id, confirmedBy);
      res.json({
        success: true,
        data
      });
    } catch (error) {
      next(error);
    }
  }
}
