import { Request, Response, NextFunction } from 'express';
import { WorkflowService } from '../services/workflowService';

export class WorkflowController {
  public static async getWorkflow(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await WorkflowService.getWorkflowProgress();
      res.json({
        success: true,
        data
      });
    } catch (error) {
      next(error);
    }
  }

  public static async nextStage(req: Request, res: Response, next: NextFunction) {
    try {
      const { targetStage } = req.body;
      const data = await WorkflowService.advanceWorkflowStage(targetStage);
      res.json({
        success: true,
        data
      });
    } catch (error) {
      next(error);
    }
  }

  public static async resetWorkflow(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await WorkflowService.resetWorkflow();
      res.json({
        success: true,
        data
      });
    } catch (error) {
      next(error);
    }
  }
}
