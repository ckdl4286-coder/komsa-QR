async function run() {
  const url = 'https://www.komsa.or.kr/bbs/BBSMSTR_000000000731/list.do?searchCondition=1&searchKeyword=' + encodeURIComponent('목포');
  const res = await fetch(url);
  const html = await res.text();
  console.log(html.substring(html.indexOf('퀸제누비아') - 200, html.indexOf('퀸제누비아') + 200));
}
run();
