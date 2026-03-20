'use client';

import { useEffect } from 'react';
import { ExternalLink, Navigation, Info, Zap, Bus, CalendarClock, ChevronRight, CheckSquare, Anchor } from 'lucide-react';
import styles from './page.module.css';

export function Tracker({ shipId }: { shipId: string }) {
  useEffect(() => {
    fetch('/api/stats/visit', { method: 'POST', body: JSON.stringify({ shipId }), headers: { 'Content-Type': 'application/json' } });
  }, [shipId]);
  return null;
}

export function ActionButton({ 
  shipId, linkId, url, title, iconName, primary = false 
}: { 
  shipId: string; linkId?: string; url: string; title: string; iconName: string; primary?: boolean 
}) {
  const handleClick = () => {
    if (url) {
      fetch('/api/stats/click', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ shipId, linkId, title }) });
    }
  };

  const getIcon = () => {
    if(iconName === 'CheckSquare') return <CheckSquare size={24} />;
    if(iconName === 'Navigation') return <Navigation size={24} />;
    if(iconName === 'Info') return <Info size={24} />;
    if(iconName === 'Zap') return <Zap size={24} />;
    if(iconName === 'Bus') return <Bus size={24} />;
    if(iconName === 'CalendarClock') return <CalendarClock size={24} />;
    if(iconName === 'Anchor') return <Anchor size={24} />;
    return <ExternalLink size={24} />;
  };

  return (
    <a 
      href={url || '#'} 
      target="_blank" 
      rel="noopener noreferrer" 
      onClick={handleClick}
      className={`glass-card ${styles.actionItem}`}
      style={{
         background: primary ? 'var(--ocean-gradient)' : 'var(--surface)',
         color: primary ? '#ffffff' : 'var(--text-dark)',
         border: primary ? 'none' : '2px solid var(--surface-border)',
         opacity: 1,
         boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
      }}
    >
      <div className={styles.actionItemLeft}>
        <div className={styles.iconBox} style={{ background: primary ? 'rgba(255,255,255,0.2)' : 'rgba(19, 56, 142, 0.08)', color: primary ? '#fff' : 'var(--primary)'}}>
          {getIcon()}
        </div>
        <span className={styles.actionTitle}>{title}</span>
      </div>
      <ChevronRight size={20} style={{ opacity: 0.6 }} />
    </a>
  );
}
