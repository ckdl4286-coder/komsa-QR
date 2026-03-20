import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log("Starting reorganization of ShipLinks...");

  // 1. Rename PATIS
  const patisRenamedCount = await prisma.shipLink.updateMany({
    where: {
      title: "실시간 운항정보(PATIS)"
    },
    data: {
      title: "여객선 교통정보 서비스(PATIS)"
    }
  });
  console.log(`Renamed PATIS service for ${patisRenamedCount.count} records.`);

  // 2. Remove BAND from bottom list
  const bandRemovedCount = await prisma.shipLink.deleteMany({
    where: {
      title: "실시간 운항정보(BAND)"
    }
  });
  console.log(`Removed BAND service from bottom list for ${bandRemovedCount.count} records.`);

  console.log("Cleanup complete.");
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
