import { Router } from 'express';
import { WorkpieceController } from '../controllers/workpieceController';

export const workpieceRouter = Router();

workpieceRouter.get('/', WorkpieceController.getAll);
workpieceRouter.post('/:id/confirm', WorkpieceController.confirm);
