import {test, expect} from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import {testConfig} from '../config/testConfig';

test('DEBUG-001 로그인 후 잘못된 URL 검증', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login(testConfig.id, testConfig.password);

    //일부러 잘못된 URL를 기대결과로 설정
    await expect(page).toHaveURL(/\/app\/wrong-page/);
});