import { Request, Response, NextFunction } from 'express';
import { ReadyReviewService } from '../services/readyReviewService';

export class ReadyReviewController {
  public static async getReview(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await ReadyReviewService.getReadyReview();
      res.json({
        success: true,
        data
      });
    } catch (error) {
      next(error);
    }
  }
}
