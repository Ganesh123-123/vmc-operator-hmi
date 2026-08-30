import { Request, Response, NextFunction } from 'express';
import { AppError } from '../middleware/errorHandler';

export class AuthController {
  public static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        throw new AppError('Username and password are required.', 400);
      }

      if (username !== 'operator' || password !== 'operator123') {
        throw new AppError('Invalid credentials. Use operator / operator123 for demo access.', 401);
      }

      const user = {
        username: 'operator',
        name: 'VMC Operator 01',
        role: 'Machinist Level 1',
        machineId: 'VMC-01',
        shift: 'Shift A (06:00 - 14:00)',
        token: 'demo-token-vmc-operator-77'
      };

      res.json({
        success: true,
        data: user
      });
    } catch (error) {
      next(error);
    }
  }

  public static async me(_req: Request, res: Response, next: NextFunction) {
    try {
      res.json({
        success: true,
        data: {
          username: 'operator',
          name: 'VMC Operator 01',
          role: 'Machinist Level 1',
          machineId: 'VMC-01',
          shift: 'Shift A (06:00 - 14:00)'
        }
      });
    } catch (error) {
      next(error);
    }
  }
}
