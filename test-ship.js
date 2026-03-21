const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const ship = await prisma.ship.findFirst({
    where: { name: '퀸제누비아2' },
    include: { links: true }
  });
  console.log(ship);
}
main();
