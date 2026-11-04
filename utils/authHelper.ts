import {APIRequestContext, expect} from '@playwright/test';
import { testConfig } from '../config/testConfig';

export async function getAccessToken(
    request: APIRequestContext
):Promise<string> {
    const response = await request.post(
        testConfig.url,
        {
            data:{
                userId: testConfig.id,
                password: testConfig.password,
                rememberMe: false
            }
        }
    );

    expect(response.status()).toBe(201);

    const result = await response.json();
    expect(result.data.accessToken).toBeTruthy();

    return result.data.accessToken;
}