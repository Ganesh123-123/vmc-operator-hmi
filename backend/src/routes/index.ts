import { Router } from 'express';
import { machineRouter } from './machineRoutes';
import { workflowRouter } from './workflowRoutes';
import { machineCheckRouter } from './machineCheckRoutes';
import { toolRouter } from './toolRoutes';
import { workpieceRouter } from './workpieceRoutes';
import { readyReviewRouter } from './readyReviewRoutes';
import { operationRouter } from './operationRoutes';
import { authRouter } from './authRoutes';
import { dashboardRouter } from './dashboardRoutes';
import { logRouter } from './logRoutes';

export const apiRouter = Router();

apiRouter.use('/auth', authRouter);
apiRouter.use('/dashboard', dashboardRouter);
apiRouter.use('/logs', logRouter);
apiRouter.use('/machine', machineRouter);
apiRouter.use('/workflow', workflowRouter);
apiRouter.use('/machine-checks', machineCheckRouter);
apiRouter.use('/tools', toolRouter);
apiRouter.use('/workpiece', workpieceRouter);
apiRouter.use('/ready-review', readyReviewRouter);
apiRouter.use('/operation', operationRouter);

// Health check endpoint
apiRouter.get('/health', (_req, res) => {
  res.json({
    status: 'HEALTHY',
    service: 'VMC HMI Backend',
    timestamp: new Date().toISOString()
  });
});
