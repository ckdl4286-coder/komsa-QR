const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const ships = await prisma.ship.findMany({
    where: { name: '퀸제누비아2' }
  });
  console.log(ships);
}
main();
