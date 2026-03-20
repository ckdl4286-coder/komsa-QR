import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

async function main() {
  const backupPath = path.join(process.cwd(), 'db_backup.json');
  if (!fs.existsSync(backupPath)) {
    console.error('백업 파일(db_backup.json)을 찾을 수 없습니다.');
    return;
  }

  const { ships, systemConfig } = JSON.parse(fs.readFileSync(backupPath, 'utf8'));

  console.log('데이터 복원을 시작합니다... (Supabase PostgreSQL)');

  // 1. 기존 데이터 정리 (충돌 방지)
  await prisma.visit.deleteMany();
  await prisma.shipLink.deleteMany();
  await prisma.ship.deleteMany();
  await prisma.systemConfig.deleteMany();
  await prisma.clickEvent.deleteMany();

  // 2. SystemConfig 복원
  for (const config of systemConfig) {
    await prisma.systemConfig.create({ data: config });
  }
  console.log('시스템 설정 복원 완료.');

  // 3. Ship 및 하위 데이터 복원
  for (const ship of ships) {
    const { links, visits, ...shipData } = ship;
    
    // 선박 생성
    await prisma.ship.create({
      data: {
        ...shipData,
        links: {
          create: links.map((l: any) => {
            const { shipId, ...linkData } = l;
            return linkData;
          })
        },
        visits: {
          create: visits.map((v: any) => {
            const { shipId, ...visitData } = v;
            return visitData;
          })
        }
      }
    });
    console.log(`선박 복원: ${ship.name}`);
  }

  console.log('모든 데이터가 Supabase로 성공적으로 복원되었습니다! 🎉');
}

main()
  .catch((e) => {
    console.error('복원 중 오류 발생:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
