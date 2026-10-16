import { test, expect } from '@playwright/test';

test('LOGIN-001 정상 로그인', async ({ page }) => {
  //1. 환경변수에서 시험 계정 가져오기
  const id = process.env.TEST_ID;
  const password = process.env.TEST_PASSWORD;
  const url = process.env.TEST_URL;

  //환경변수가 없는 경우 오류 발생
  if(!id || !password || !url){
    throw new Error('시험 환경변수가 설정되지 않았습니다.');
  }

  //2. 웹페이지 접속 
  await page.goto(url);
  
  //3. 로그인 화면 이동
  await page.getByRole('link', { name: '로그인' }).click();
  
  //4. id, pw 입력
  await page.getByRole('textbox', { name: '아이디' }).click();
  await page.getByRole('textbox', { name: '아이디' }).fill(id);

  await page.getByRole('textbox', { name: '비밀번호' }).click();
  await page.getByRole('textbox', { name: '비밀번호' }).fill(password);

  //5. 로그인
  await page.getByRole('button', { name: '로그인' }).click();

  //6. 기대 결과 검증
  await expect(page).toHaveURL(/\/app\/dashboard/);

  //7. 검증 코드
  /*
    page : 현재 Playwright가 조작하는 웹페이지
    getByText() : 특정 텍스트를 가진 HTML 요소 찾기
    expect() : 해당 요소가 기대 조건을 만족하는지 검증
    toBeVisible() : 요소가 화면에 표시되는지 확인
    await : 비동기 검증이 끝날 때까지 기다리기
  */
  await expect(
    page.getByRole('heading', {
      name:'나의 프로젝트', exact: true
    })
  ).toBeVisible();

});