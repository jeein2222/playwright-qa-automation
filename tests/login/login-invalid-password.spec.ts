import { test, expect } from '@playwright/test';
import { testConfig } from '../../config/testConfig';

test('LOGIN-002 잘못된 비밀번호 입력 시 로그인 실패', async ({ page }) => {

  await page.goto(testConfig.url);
  await page.getByRole('link', { name: '로그인' }).click();
  await page.getByRole('textbox', { name: '아이디' }).click();
  await page.getByRole('textbox', { name: '아이디' }).fill(testConfig.id);
  await page.getByRole('textbox', { name: '비밀번호' }).click();
  await page.getByRole('textbox', { name: '비밀번호' }).fill('11111111');
  await page.getByRole('button', { name: '로그인' }).click();

  // 기대 결과 검증 : 로그인 페이지 유지
  await expect(page).toHaveURL(/\/login\/?$/);

  // 대시보드 제목이 표시되지 않는지 검증
  await expect(
    page.getByRole('heading', {name:'나의 프로젝트'})
  ).not.toBeVisible();

});