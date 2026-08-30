import { Router } from 'express';
import { MachineController } from '../controllers/machineController';

export const machineRouter = Router();

machineRouter.get('/', MachineController.getMachine);
