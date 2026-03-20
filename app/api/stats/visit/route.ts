export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { shipId } = body;
    
    if (shipId) {
      const db = (await import('../../../lib/db')).prisma;
      await db.visit.create({ data: { shipId } });
      await db.systemConfig.upsert({
        where: { id: 'global' },
        create: { id: 'global', totalVisitors: 1 },
        update: { totalVisitors: { increment: 1 } }
      });
      return new Response(JSON.stringify({ success: true }), { status: 200 });
    }
  } catch(e) {
    return new Response('Error', { status: 500 });
  }
  return new Response('Invalid', { status: 400 });
}
