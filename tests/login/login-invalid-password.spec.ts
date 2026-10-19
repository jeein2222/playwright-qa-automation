import { test, expect } from '@playwright/test';
import { testConfig } from '../../config/testConfig';
import { LoginPage } from '../../pages/LoginPage';

test('LOGIN-002 잘못된 비밀번호 입력 시 로그인 실패', async ({ page }) => {

  const loginPage = new LoginPage(page);

  //1. 로그인 페이지 이동
  await loginPage.goto();

  //2. 잘못된 비밀번호로 로그인 시도
  await loginPage.login(
    testConfig.id,
    'WrongPassword123!'
  );

  //3. 기대 결과 검증
  await expect(page).toHaveURL(/\/login\/?$/);

  // 대시보드 제목이 표시되지 않는지 검증
  await expect(
    page.getByRole('heading', {name:'나의 프로젝트'})
  ).not.toBeVisible();

});