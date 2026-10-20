import {test, expect} from '@playwright/test';
import {testConfig} from '../../config/testConfig';
import {LoginPage} from '../../pages/LoginPage';

test('AUTH-002 로그아웃 후 뒤로 가기 시 인증 페이지 접근 차단', async ({page}) => {
    const loginPage = new LoginPage(page);

    //1. 정상 로그인
    await loginPage.goto();
    await loginPage.login(
        testConfig.id,
        testConfig.password
    );

    //2. 로그인 성공 확인
    await expect(page).toHaveURL(/\/app\/dashboard/);

    //3. 로그아웃
    await page.getByRole('button', { name:'내 계정'}).click();
    await page.getByRole('menuitem', {name:'로그아웃'}).click();

    //4. 로그아웃 후 로그인 페이지 이동 확인
    await expect(page).toHaveURL(/\/login(?:[/?#]|$)/);

    //5. 브라우저 뒤로 가기
    await page.goBack();

    //6. 뒤로 가기 후 새로고침
    await page.reload();

    //7. 인증 페이지 접근 제한 확인
    await expect(page).toHaveURL(/\/login(?:[/?#]|$)/);

    //8. 대시보드 직접 접근 시도
    await page.goto(
        new URL('/app/dashboard', testConfig.url).toString()
    );
});