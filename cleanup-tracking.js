const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const result = await prisma.shipLink.deleteMany({
    where: {
      url: 'tracking-only'
    }
  });
  console.log('Deleted tracking-only rows:', result.count);
}
main();
