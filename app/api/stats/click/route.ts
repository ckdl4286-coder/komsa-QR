export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { linkId, shipId, title } = body;
    
    const db = (await import('../../../lib/db')).prisma;

    if (shipId && title) {
      await db.clickEvent.create({ data: { shipId, title } });
      const existing = await db.shipLink.findFirst({ where: { shipId, title } });
      if (existing) {
        await db.shipLink.update({ where: { id: existing.id }, data: { clicks: { increment: 1 } } });
      } else {
        await db.shipLink.create({ data: { shipId, title, url: 'tracking-only', clicks: 1 } });
      }
      return new Response(JSON.stringify({ success: true }), { status: 200 });
    }
  } catch(e) {
    return new Response('Error', { status: 500 });
  }
  return new Response('Invalid', { status: 400 });
}
