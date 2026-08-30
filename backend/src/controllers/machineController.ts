import { Request, Response, NextFunction } from 'express';
import { MachineService } from '../services/machineService';

export class MachineController {
  public static async getMachine(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await MachineService.getMachineDetails();
      res.json({
        success: true,
        data
      });
    } catch (error) {
      next(error);
    }
  }
}
