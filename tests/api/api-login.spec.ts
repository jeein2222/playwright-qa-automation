import {test, expect} from '@playwright/test';
import {testConfig} from '../../config/testConfig';

test('API-001 정상 계정으로 로그인 API 호출', async( { request }) => {
    //Arrange: 요청 데이터 준비
    const loginData = {
        userId: testConfig.id,
        password: testConfig.password,
        rememberMe: false
    };

    //Act: 로그인 API 호출
    const response = await request.post(
         '로그인 API',
        {data:loginData}
    );

    //Assert: 응답 검증
    expect(response.status()).toBe(201);

    expect(response.headers()['content-type']).toContain('application/json');

    const responseData = await response.json();

    //비즈니스 응답 검증
    expect(responseData.success).toBe(true);
    expect(responseData.statusCode).toBe(201);
    expect(responseData.data.message).toBe('로그인 성공');

    //토큰 검증
    expect(responseData.data.accessToken).toBeTruthy();
    expect(responseData.data.refreshToken).toBeTruthy();
    expect(responseData.data.tokenType).toBe('bearer');

    //사용자 정보 검증
    expect(responseData.data.user.userId).toBe(testConfig.id);
});