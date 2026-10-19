import {test, expect} from '@playwright/test';
import { testConfig } from '../../config/testConfig';
import { LoginPage } from '../../pages/LoginPage';

test('LOGOUT-001 정상 로그아웃 및 로그인 화면 이동 확인', async ({ page }) => {
  const loginPage = new LoginPage(page);

  //1. 로그인
  await loginPage.goto();
  await loginPage.login(testConfig.id, testConfig.password);

  //2. 로그인 성공 확인
  await expect(page).toHaveURL(/\/app\/dashboard/);

  // 3. 대시보드 제목 확인
  await expect(
    page.getByRole('heading', { name: '나의 프로젝트' })
  ).toBeVisible();

  // 4. 내 계정 클릭
  await page.getByRole('button', { name: '내 계정' }).click();
  
  // 5. 로그아웃 
  await page.getByText('로그아웃').click();

  // 6. 로그아웃 기대 결과 검증
  await expect(page).toHaveURL(/\/login/);

});