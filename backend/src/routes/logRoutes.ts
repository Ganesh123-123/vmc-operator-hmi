import { Router, Request, Response, NextFunction } from 'express';
import { prisma } from '../database/prisma';

export const logRouter = Router();

logRouter.get('/', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const logs = await prisma.operationLog.findMany({
      take: 30,
      orderBy: { createdAt: 'desc' }
    });
    res.json({
      success: true,
      data: logs
    });
  } catch (error) {
    next(error);
  }
});
