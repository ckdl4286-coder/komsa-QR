
import { fetchShipSchedule } from '../app/lib/komsa';

async function test() {
  const shipName = '섬사랑11호';
  console.log(`🚀 [KOMSA] ${shipName} 데이터 조회 테스트 시작...`);
  
  try {
    const schedules = await fetchShipSchedule(shipName);
    if (!schedules || schedules.length === 0) {
      console.log('❌ 데이터가 없습니다. (정보준비중 상태)');
    } else {
      console.log('✅ 조회 성공!');
      console.table(schedules.map(s => ({
        날짜: s.rlvt_ymd,
        시간: s.sail_tm,
        상세: s.nvg_stts_nm,
        상태명: s.nvg_se_nm
      })));
    }
  } catch (e) {
    console.error('❌ 에러 발생:', e);
  }
}

test();
