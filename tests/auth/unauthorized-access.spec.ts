import { test, expect } from '@playwright/test';
import { testConfig } from '../../config/testConfig';

test('AUTH-001 비로그인 상태에서 인증 페이지 접근 차단', async ({browser}) => {
    //1. 새로운 브라우저 컨텍스트 생성(비로그인 상태)
    const context = await browser.newContext();

    const page = await context.newPage();

    try{
        //2. 인증이 필요한 URL 직접 접근
        const dashboardUrl = new URL(
            '/app/dashboard',
            testConfig.url
        ).toString();

        await page.goto(dashboardUrl);

        //3. 기대 결과: 로그인 페이지로 이동
        await expect(page).toHaveURL(/\/login(?:[/?#]|$)/);

        //4. 로그인 화면 표시 확인
        await expect(
            page.getByRole('button', {name: '로그인'})
        ).toBeVisible();

    }finally{
        //5. 브라우저 컨텍스트 종료
        await context.close();
    }
});