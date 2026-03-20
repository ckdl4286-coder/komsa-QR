import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "postgresql://postgres:admin12345mokpo@db.mmrcsbpklcekilsoopql.supabase.co:5432/postgres?sslmode=require"
    }
  }
})

async function main() {
  try {
    console.log('🚀 DB 연결 시도 중...')
    const result = await prisma.ship.count()
    console.log('✅ 성공! 선박 데이터 개수:', result)
  } catch (e: any) {
    console.error('❌ 실패! 에러 메시지:', e.message)
  } finally {
    await prisma.$disconnect()
  }
}

main()
