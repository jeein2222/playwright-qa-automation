import {test, expect} from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { testConfig } from '../../config/testConfig';

test.describe('로그인 기능 테스트 with test hook', () => {
    test.beforeEach(async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.goto();
    })

    test('LOGIN-001 정상 로그인', async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.login(
            testConfig.id,
            testConfig.password
        );
        await expect(page).toHaveURL(/\/app\/dashboard/);
    });

    test('LOGIN-002 비밀번호 오류', async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.login(
            testConfig.id,
            'WrongPassword123!'
        );
        await expect(page).toHaveURL(/\/login\/?$/);
    });
});