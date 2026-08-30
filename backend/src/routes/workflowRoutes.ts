import { Router } from 'express';
import { WorkflowController } from '../controllers/workflowController';

export const workflowRouter = Router();

workflowRouter.get('/', WorkflowController.getWorkflow);
workflowRouter.post('/next', WorkflowController.nextStage);
workflowRouter.post('/reset', WorkflowController.resetWorkflow);
