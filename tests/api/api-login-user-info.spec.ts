import {test, expect} from '@playwright/test';
import {testConfig} from '../../config/testConfig';
import {getAccessToken} from '../../utils/authHelper';

test('API-002 로그인 후 사용자 정보 조회', async ({request}) => {
    const accessToken = await getAccessToken(request);
   
    //3. 사용자 정보 조회 API 호출
    const userResponse = await request.get(
        '사용자 정보 조회 API',
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