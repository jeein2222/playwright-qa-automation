import { test, expect } from '@playwright/test';
import { testConfig } from '../../config/testConfig';
import { LoginPage } from '../../pages/LoginPage';


test('LOGIN-001 정상 로그인', async ({ page }) => {
  const loginPage = new LoginPage(page);

  //1. 로그인 페이지 접속
  await loginPage.goto();

  //2. 로그인 수행
  await loginPage.login(
    testConfig.id,
    testConfig.password
  );

  //3. 기대 결과 검증
  await expect(page).toHaveURL(/\/app\/dashboard/);

  await expect(
    page.getByRole('heading', {
      name:'나의 프로젝트', exact: true
    })
  ).toBeVisible();

});