import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '여객선 안전정보 QR 서비스 | KOMSA',
  description: '출항 전 안전점검표, 실시간 운항예보 등 여객선 안전 정보를 한눈에 확인하세요.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>
        <main style={{ maxWidth: '500px', margin: '0 auto', minHeight: '100vh', background: 'transparent', position: 'relative' }}>
          {children}
        </main>
      </body>
    </html>
  );
}
