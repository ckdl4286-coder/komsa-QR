import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';

const prisma = new PrismaClient();

async function main() {
  const ships = await prisma.ship.findMany({ include: { links: true, visits: true } });
  const systemConfig = await prisma.systemConfig.findMany();
  
  const backupData = { ships, systemConfig };
  fs.writeFileSync('db_backup.json', JSON.stringify(backupData, null, 2), 'utf-8');
  console.log('Database backup successfully saved to db_backup.json!');
}

main().catch(console.error).finally(() => prisma.$disconnect());
