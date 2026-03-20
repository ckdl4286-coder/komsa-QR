'use client';
export function BandStatusButton({ shipId }: { shipId: string }) {
  return (
    <a 
      href="https://band.us/band/71958658/post" 
      target="_blank" 
      rel="noopener noreferrer" 
      className="statusBtn"
      onClick={() => {
        fetch('/api/stats/click', { 
           method: 'POST', 
           headers: { 'Content-Type': 'application/json' }, 
           body: JSON.stringify({ shipId, title: '[외부] 밴드 실시간 운항정보' }) 
        });
      }}
      style={{ display: 'block', background: 'var(--primary)', color: 'white', padding: '1rem', borderRadius: '14px', fontWeight: 700, fontSize: '1.1rem', boxShadow: '0 6px 16px rgba(19, 56, 142, 0.25)', textDecoration: 'none', transition: 'transform 0.2s' }}
    >
      실시간 운항정보 확인하기 👉
    </a>
  );
}
