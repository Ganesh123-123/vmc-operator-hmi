import { app } from './app';
import { ensureDatabaseReady } from './database/prisma';

const PORT = process.env.PORT || 5000;

async function bootstrap() {
  try {
    await ensureDatabaseReady();

    app.listen(PORT, () => {
      console.log(`==================================================`);
      console.log(`  VMC OPERATOR HMI – BACKEND SERVICE`);
      console.log(`  Machine: VMC-01 (3-Axis Vertical Machining Center)`);
      console.log(`  Listening on: http://localhost:${PORT}`);
      console.log(`  API Status: http://localhost:${PORT}/api/health`);
      console.log(`==================================================`);
    });
  } catch (error) {
    console.error('Fatal error during backend server startup:', error);
    process.exit(1);
  }
}

bootstrap();
