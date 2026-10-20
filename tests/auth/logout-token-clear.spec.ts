import { test, expect } from '@playwright/test';
import { testConfig } from '../../config/testConfig';
import { LoginPage } from '../../pages/LoginPage';
import { exec } from 'node:child_process';

test('AUTH-003 로그아웃 후 인증 토큰 삭제 확인', async({page}) => {
    const loginPage = new LoginPage(page);

    //1. 정상 로그인
    await loginPage.goto();
    await loginPage.login(testConfig.id, testConfig.password);

    await expect(page).toHaveURL(/\/app\/dashboard/);

    //2. 로그인 후 Session Storage의 키 목록 확인
    const before = await page.evaluate(() => ({
        accessTokenExists: Boolean(
            sessionStorage.getItem('semo_access_token')
        ),
        refreshTokenExists: Boolean(
            sessionStorage.getItem('semo_refresh_token')
        )
    }));

    console.log('로그인 후 토큰 상태:', before);

    expect(before.accessTokenExists).toBe(true);
    expect(before.refreshTokenExists).toBe(true);

    //3. 로그아웃
    await page.getByRole('button', {name:'내 계정'}).click();
    await page.getByRole('menuitem', {name:'로그아웃'}).click();

    await expect(page).toHaveURL(/\/login(?:[/?#]|$)/);

    //4. 로그아웃 후 토큰 존재 여부 확인
    const after = await page.evaluate(()=>({
        accessTokenExists: Boolean(
            sessionStorage.getItem('semo_access_token')
        ),
        refreshTokenExists: Boolean(
            sessionStorage.getItem('semo_refresh_token')
        )
    }));

    console.log('로그아웃 후 토큰 상태: ', after);

    //5. 기대 결과 검증
    expect(after.accessTokenExists).toBe(false);
    expect(after.refreshTokenExists).toBe(false);
    
});