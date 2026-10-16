function getRequiredEnv(name:string): string {
    const value = process.env[name];

    if(!value){
        throw new Error('${name} 환경변수가 설정되지 않았습니다.');
    }

    return value;
}

export const testConfig = {
    url: getRequiredEnv('TEST_URL'),
    id: getRequiredEnv('TEST_ID'),
    password: getRequiredEnv('TEST_PASSWORD')
}