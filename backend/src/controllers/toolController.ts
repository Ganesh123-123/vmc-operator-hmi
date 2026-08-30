import { Request, Response, NextFunction } from 'express';
import { ToolService } from '../services/toolService';

export class ToolController {
  public static async getAll(_req: Request, res: Response, next: NextFunction) {
    try {
      const data = await ToolService.getAllTools();
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
      const data = await ToolService.confirmTool(id);
      res.json({
        success: true,
        data
      });
    } catch (error) {
      next(error);
    }
  }
}
