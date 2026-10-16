import {test, expect} from '@playwright/test';

test('LOGOUT-001 정상 로그아웃 및 로그인 화면 이동 확인', async ({ page }) => {

  //1. 환경변수에서 시험 계정 가져오기
  const id = process.env.TEST_ID;
  const password = process.env.TEST_PASSWORD;
  const url = process.env.TEST_URL;

  //환경변수가 없는 경우 오류 발생
  if(!id || !password || !url){
    throw new Error('시험 환경변수가 설정되지 않았습니다.');
  }

  // 2. 웹페이지 접속
  await page.goto(url);
  
  // 3. 로그인 화면 이동
  await page.getByRole('link', { name: '로그인' }).click();
  
  // 4. 아이디, 비밀번호 입력
  await page.getByRole('textbox', { name: '아이디' }).click();
  await page.getByRole('textbox', { name: '아이디' }).fill(id);
  await page.getByRole('textbox', { name: '아이디' }).press('Tab');
  await page.getByRole('textbox', { name: '비밀번호' }).fill(password);
  
  // 5. 로그인
  await page.getByRole('button', { name: '로그인' }).click();

  // 로그인 완료 확인
  await expect(page).toHaveURL(/\/app\/dashboard/);

  // 대시보드 제목 확인
  await expect(
    page.getByRole('heading', { name: '나의 프로젝트' })
  ).toBeVisible();

  // 6. 내 계정 클릭
  await page.getByRole('button', { name: '내 계정' }).click();
  
  // 7. 로그아웃 
  await page.getByText('로그아웃').click();

  //로그아웃 기대 결과 검증
  await expect(page).toHaveURL(/\/login/);

});