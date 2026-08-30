import { Router } from 'express';
import { ToolController } from '../controllers/toolController';

export const toolRouter = Router();

toolRouter.get('/', ToolController.getAll);
toolRouter.post('/:id/confirm', ToolController.confirm);
