import { notFound } from 'next/navigation';
import { prisma } from '../lib/db';
import styles from './page.module.css';
import { Tracker, ActionButton } from './ClientInteractions';
import { BandStatusButton } from './BandStatusButton';
import { Ship } from 'lucide-react';
import { fetchShipSchedule, getStatusInfo, formatTime, formatDate } from '../lib/komsa';

export const dynamic = 'force-dynamic';

export default async function ShipPage({ params }: { params: Promise<{ shipId: string }> }) {
  const { shipId } = await params;
  const decodedSlug = decodeURIComponent(shipId);
  const ship = await prisma.ship.findUnique({
    where: { urlSlug: decodedSlug },
    include: { links: true }
  });

  if (!ship) return notFound();

  const config = await prisma.systemConfig.findUnique({ where: { id: 'global' } });

  // KOMSA API로 내일 운항 일정 조회
  let schedules = null;
  try {
    schedules = await fetchShipSchedule(ship.name);
  } catch (e) {
    console.error('[선박 페이지] 운항 일정 조회 실패:', e);
  }

  // 대표 운항 상태 (첫 번째 스케줄 기준)
  const mainSchedule = schedules?.[0] ?? null;
  const statusInfo = getStatusInfo(mainSchedule);

  // 관리자가 입력한 날씨 메시지 (API 대체 or 보완용)
  const adminWeather = config?.tomorrowWeather;

  return (
    <div className={styles.container}>
      <Tracker shipId={ship.id} />
      
      <header className={styles.header}>
        <img
          src="/character.jpg"
          alt="KOMSA 캐릭터"
          style={{
            width: '90px', height: '90px', objectFit: 'cover',
            margin: '0 auto 1.2rem auto', display: 'block',
            borderRadius: '50%', border: '3px solid #00A3DD',
            padding: '3px', background: 'white',
            boxShadow: '0 4px 12px rgba(0,163,221,0.2)'
          }}
        />
        <h1 className={styles.shipName}>{ship.name}</h1>
        <p className={styles.subTitle} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
           <img src="/logo.png" alt="KOMSA 로고" style={{ height: '16px', objectFit: 'contain' }} /> 안전 여객 서비스
        </p>
      </header>

      {/* 내일 운항 예보 (KOMSA API 자동 연동) */}
      <div className={styles.statusBox} style={{ background: statusInfo.bgColor, borderColor: statusInfo.color + '33' }}>
        {/* 기준 날짜 표시 */}
        {mainSchedule?.rlvt_ymd && (
          <div style={{ fontSize: '0.85rem', fontWeight: 600, color: statusInfo.color, marginBottom: '0.5rem' }}>
            📅 {formatDate(mainSchedule.rlvt_ymd)} 운항여부
          </div>
        )}
        
        {/* 운항 상태 배지 */}
        <div
          className={styles.statusBadge}
          style={{ background: statusInfo.color, color: '#fff' }}
        >
          {statusInfo.emoji} {statusInfo.label}
        </div>

        {/* 사유 표시 (통제/비운항 시) */}
        {statusInfo.reason && (
          <p className={styles.statusDesc} style={{ color: statusInfo.color, fontWeight: 700, marginBottom: '0.5rem' }}>
            사유: {statusInfo.reason}
          </p>
        )}

        {/* 운항 스케줄 요약 (데이터 있을 때) */}
        {schedules && schedules.length > 0 && (
          <div style={{ fontSize: '0.85rem', color: '#475569', marginTop: '0.5rem', marginBottom: '0.75rem' }}>
            {schedules.slice(0, 3).map((s, i) => (
              <div key={i} style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '0.2rem' }}>
                {s.sail_tm && <span>🕐 {formatTime(s.sail_tm)}</span>}
                {s.oport_nm && s.dest_nm && (
                  <span>{s.oport_nm} → {s.dest_nm}</span>
                )}
              </div>
            ))}
          </div>
        )}

        {/* API 데이터 없을 때 관리자 입력 메세지 표시 */}
        {!mainSchedule && adminWeather && (
          <p className={styles.statusDesc}>{adminWeather}</p>
        )}

        <BandStatusButton shipId={ship.id} />
      </div>

      {/* 필수 안전정보 */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>📄 필수 안전정보</h2>
        <ActionButton shipId={ship.id} linkId="core" url={ship.checklistUrl || ""} title="출항 전 점검표" iconName="CheckSquare" primary={false} />
        <ActionButton shipId={ship.id} linkId="core" url={ship.regulationsUrl || ""} title="운항관리규정" iconName="Navigation" primary={false} />
        <ActionButton shipId={ship.id} linkId="core" url={ship.safetyInfoUrl || ""} title="여객선 안전정보" iconName="Anchor" primary={false} />
      </section>

      {/* 추가 공단 대국민 서비스 */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>
           <Ship size={20} color="var(--primary)" /> 편리한 추가 서비스
        </h2>
        {ship.links.map((link: any) => (
          <ActionButton key={link.id} shipId={ship.id} linkId={link.id} url={link.url} title={link.title} iconName={link.icon || 'ExternalLink'} />
        ))}
      </section>

      <footer style={{ textAlign: 'center', marginTop: '3.5rem', fontSize: '0.85rem', color: 'var(--text-light)', borderTop: '1px solid #e2e8f0', paddingTop: '1.5rem' }}>
        <p>ⓒ 2026 한국해양교통안전공단 목포운항관리센터</p>
        <p style={{ fontWeight: '600', marginTop: '4px' }}>세상에서 가장 안전한 바닷길을 만들겠습니다.</p>
      </footer>
    </div>
  );
}
