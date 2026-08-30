import { Router } from 'express';
import { MachineCheckController } from '../controllers/machineCheckController';

export const machineCheckRouter = Router();

machineCheckRouter.get('/', MachineCheckController.getAll);
machineCheckRouter.post('/:id/confirm', MachineCheckController.confirm);
