import { Router } from 'express';
import { OperationController } from '../controllers/operationController';

export const operationRouter = Router();

operationRouter.get('/', OperationController.getTelemetry);
operationRouter.post('/start', OperationController.start);
operationRouter.post('/stop', OperationController.stop);
