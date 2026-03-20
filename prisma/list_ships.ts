import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const ships = await prisma.ship.findMany({ select: { name: true, urlSlug: true } });
  console.log(JSON.stringify(ships));
}
main().catch(e => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
