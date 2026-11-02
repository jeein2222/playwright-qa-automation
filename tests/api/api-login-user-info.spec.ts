import {test, expect} from '@playwright/test';
import {testConfig} from '../../config/testConfig';

test('API-002 로그인 후 사용자 정보 조회', async ({request}) => {
    //1. 로그인 API 호출
    const loginResponse = await request.post(
        '로그인 API',
        {
            data:{
                userId: testConfig.id,
                password: testConfig.password,
                rememberMe: false
            }
        }
    );

    expect(loginResponse.status()).toBe(201);

    //2. 로그인 응답에서 Access Token 호출
    const loginData = await loginResponse.json();

    expect(loginData.data.accessToken).toBeTruthy();

    const accessToken = loginData.data.accessToken;
   
    //3. 사용자 정보 조회 API 호출
    const userResponse = await request.get(
        'https://api-dev.semo.io.kr/auth/me',
        {
            headers:{
                Authorization: `Bearer ${accessToken}`
            }
        }
    );

    //4. HTTP 응답 검증
    expect(userResponse.status()).toBe(200);

    //5. 사용자 정보 검증
    const userData = await userResponse.json();

    expect(userData.success).toBe(true);
    expect(userData.statusCode).toBe(200);
    expect(userData.data.userId).toBe(testConfig.id);
    expect(userData.data.userType).toBe('buyer');

});