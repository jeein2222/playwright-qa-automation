import {test, expect} from '@playwright/test';
import { testConfig } from '../../config/testConfig';


test('API-003 토큰 없이 사용자 정보 조회 시 접근 차단', async ({request}) => {
    // Arrange: 인증 토큰을 설정하지 않음.

    // Act: 사용자 정보 조회 API 호출
    const response = await request.get(
        '사용자 정보 조회 API'
    )

    // Assert: 인증 실패 확인
    expect(response.status()).toBe(401);

    const responseData = await response.json();
    expect(responseData.success).toBe(false);
    expect(responseData.error.code).toBe('SEMO_AUTH_002');
});

test('API-004 잘못된 토큰으로 사용자 조회', async ({request})=> {
    const response = await request.get(
        '사용자 정보 조회 API',
        {
            headers :{
                Authorization: 'Bearer invalid-token' 
            }
        }
    );

    expect(response.status()).toBe(401)
});