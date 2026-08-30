import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { apiRouter } from './routes';
import { errorHandler } from './middleware/errorHandler';

dotenv.config();

export const app = express();

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true
}));

app.use(express.json());

// Request logger for industrial audit
app.use((req, _res, next) => {
  if (process.env.NODE_ENV !== 'test') {
    console.log(`[HMI ${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  }
  next();
});

// API Routes
app.use('/api', apiRouter);

// Fallback 404 handler for API routes
app.use('/api/*', (_req, res) => {
  res.status(404).json({
    success: false,
    error: {
      message: 'API endpoint not found.',
      statusCode: 404
    }
  });
});

// Global Error Handler
app.use(errorHandler);
