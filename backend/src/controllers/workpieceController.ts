import { Request, Response, NextFunction } from 'express';
import { WorkpieceService } from '../services/workpieceService';

export class WorkpieceController {
  public static async getAll(_req: Request, res: Response, next: NextFunction) {
    try {
      const data = await WorkpieceService.getAllWorkpieceItems();
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
      const data = await WorkpieceService.confirmWorkpieceItem(id);
      res.json({
        success: true,
        data
      });
    } catch (error) {
      next(error);
    }
  }
}
