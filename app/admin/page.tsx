import { prisma } from '../lib/db';
import styles from './admin.module.css';
import AdminDashboard from './AdminDashboard';
import { login, logout } from './actions';
import { cookies } from 'next/headers';
import { LogOut, ShieldCheck, Settings } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const cookieStore = await cookies();
  const isAuthenticated = cookieStore.get('admin-auth')?.value === 'true';

  if (!isAuthenticated) {
    return (
      <div className={styles.layout} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ background:'white', padding:'3rem', borderRadius:'16px', textAlign:'center', boxShadow:'0 10px 30px rgba(0,0,0,0.05)', maxWidth:'400px', width:'100%' }}>
          <ShieldCheck size={48} color="#238299" style={{marginBottom:'1rem'}} />
          <h2 style={{ fontSize: '1.6rem', color: '#1e293b', marginBottom: '2rem', fontWeight: 800 }}>QR 링크 관리자</h2>
          <form action={login} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <input type="text" name="id" placeholder="아이디" style={{padding:'1rem', borderRadius:'8px', border:'1px solid #cbd5e1', fontSize:'1rem'}} required />
            <input type="password" name="password" placeholder="비밀번호" style={{padding:'1rem', borderRadius:'8px', border:'1px solid #cbd5e1', fontSize:'1rem'}} required />
            <button type="submit" style={{padding:'1rem', borderRadius:'8px', border:'none', background:'#238299', color:'white', fontSize:'1.1rem', fontWeight:700, cursor:'pointer', marginTop:'1rem'}}>로그인</button>
          </form>
        </div>
      </div>
    );
  }

  const config = await prisma.systemConfig.findUnique({ where: { id: 'global' } });
  const ships = await prisma.ship.findMany({ 
    include: { 
      links: true, 
      visits: { select: { createdAt: true } } 
    },
    orderBy: { createdAt: 'desc' } 
  });
  
  const allClickEvents = await prisma.clickEvent.findMany();

  const urlOrigin = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <div className={styles.headerTitle}>
          <Settings size={22} /> QR 링크 관리 대시보드
        </div>
        <form action={logout}>
          <button type="submit" className={styles.previewBtn} style={{background:'#1a6e83', color:'white', border:'none'}}><LogOut size={16}/> 로그아웃</button>
        </form>
      </header>

      <AdminDashboard 
        ships={ships} 
        config={config} 
        allClickEvents={allClickEvents} 
        urlOrigin={urlOrigin} 
      />
    </div>
  );
}
