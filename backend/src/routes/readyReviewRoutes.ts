import { Router } from 'express';
import { ReadyReviewController } from '../controllers/readyReviewController';

export const readyReviewRouter = Router();

readyReviewRouter.get('/', ReadyReviewController.getReview);
