const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const links = await prisma.shipLink.findMany({
    where: {
      OR: [
        { title: { contains: 'VR' } },
        { title: { contains: '전기차' } }
      ]
    },
    select: { url: true, title: true }
  });
  console.log(links);
}
main();
