import { prisma } from '../app/lib/db';

async function updateLinks() {
  const data = [
    { name: '퀸제누비아', safety: 'https://www.komsa.or.kr/synapsoft/FileViewer.do?atchFileId=FILE_kst000600599920&fileSn=1', reg: 'https://www.komsa.or.kr/synapsoft/FileViewer.do?atchFileId=FILE_kst000600599920&fileSn=0' },
    { name: '퀸제누비아2', safety: 'https://www.komsa.or.kr/synapsoft/FileViewer.do?atchFileId=FILE_000000013694Ie4&fileSn=0', reg: 'https://www.komsa.or.kr/synapsoft/FileViewer.do?atchFileId=FILE_000000013694Ie4&fileSn=1' },
    { name: '엔젤호', safety: 'https://www.komsa.or.kr/synapsoft/FileViewer.do?atchFileId=FILE_000000022519Io1&fileSn=0', reg: 'https://www.komsa.or.kr/synapsoft/FileViewer.do?atchFileId=FILE_000000022519Io1&fileSn=1' },
    { name: '해진아일랜드', safety: 'https://www.komsa.or.kr/synapsoft/FileViewer.do?atchFileId=FILE_kst000600599460&fileSn=0', reg: 'https://www.komsa.or.kr/synapsoft/FileViewer.do?atchFileId=FILE_kst000600599460&fileSn=1' },
    { name: '슬로시티5호', safety: 'https://www.komsa.or.kr/synapsoft/FileViewer.do?atchFileId=FILE_000000018651Lk2&fileSn=0', reg: 'https://www.komsa.or.kr/synapsoft/FileViewer.do?atchFileId=FILE_000000018651Lk2&fileSn=1' },
    { name: '슬로시티6호', safety: 'https://www.komsa.or.kr/synapsoft/FileViewer.do?atchFileId=FILE_000000016034Kj5&fileSn=0', reg: 'https://www.komsa.or.kr/synapsoft/FileViewer.do?atchFileId=FILE_000000016034Kj5&fileSn=1' },
    { name: '섬사랑17호', safety: 'https://www.komsa.or.kr/synapsoft/FileViewer.do?atchFileId=FILE_kst000600591647&fileSn=0', reg: 'https://www.komsa.or.kr/synapsoft/FileViewer.do?atchFileId=FILE_kst000600591647&fileSn=1' },
    { name: '해진고속카페리', safety: 'https://www.komsa.or.kr/synapsoft/FileViewer.do?atchFileId=FILE_000000016044Xg7&fileSn=0', reg: 'https://www.komsa.or.kr/synapsoft/FileViewer.do?atchFileId=FILE_000000016044Xg7&fileSn=1' },
    { name: '슬로아일랜드호', safety: 'https://www.komsa.or.kr/synapsoft/FileViewer.do?atchFileId=FILE_kst000600599462&fileSn=0', reg: 'https://www.komsa.or.kr/synapsoft/FileViewer.do?atchFileId=FILE_kst000600599462&fileSn=1' },
  ];

  console.log('🚀 선박 링크 업데이트 시작...');
  
  for (const item of data) {
    const ship = await prisma.ship.findFirst({ where: { name: item.name } });
    if (ship) {
      await prisma.ship.update({
        where: { id: ship.id },
        data: {
          safetyInfoUrl: item.safety,
          regulationsUrl: item.reg
        }
      });
      console.log(`✅ ${item.name} 업데이트 완료`);
    } else {
      console.log(`⚠️ ${item.name} 선박을 찾을 수 없습니다.`);
    }
  }
}

updateLinks()
  .then(() => console.log('🏁 모든 작업 완료!'))
  .catch(e => console.error(e));
