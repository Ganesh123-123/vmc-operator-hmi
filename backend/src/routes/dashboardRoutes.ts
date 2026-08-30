import { Router } from 'express';
import { DashboardController } from '../controllers/dashboardController';

export const dashboardRouter = Router();

dashboardRouter.get('/stats', DashboardController.getStats);
