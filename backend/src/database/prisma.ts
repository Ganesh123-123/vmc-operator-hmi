import { PrismaClient } from '@prisma/client';
import { runDatabaseSeed } from './seedData';

export const prisma = new PrismaClient();

export async function ensureDatabaseReady() {
  try {
    const machine = await prisma.machine.findUnique({
      where: { id: 'VMC-01' }
    });

    if (!machine) {
      console.log('Database not seeded yet. Seeding default VMC dataset...');
      await runDatabaseSeed();
    }
  } catch (error) {
    console.error('Database connection / initialization check failed:', error);
  }
}
