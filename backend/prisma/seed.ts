import { prisma } from '../src/database/prisma';
import { runDatabaseSeed } from '../src/database/seedData';

if (require.main === module) {
  runDatabaseSeed()
    .catch((e) => {
      console.error('Database seed error:', e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
