import { test, expect } from '@playwright/test';

//각 테스트는 다른 테스트의 실행 결과에 의존하지 않도록 독립적으로 설계해야 한다. 
test('PROJECT-002 정상 프로젝트 조회', async ({request}) => {
    //1. Given 사전 조건 : 조회할 프로젝트 생성
    const projectName =  `ReadTest-${Date.now()}`;

    const createResponse = await request.post('/projects', {
        data: {name:projectName}
    });

    expect(createResponse.status()).toBe(201);

    const createdProject = await createResponse.json();

    //2. When 생성된 프로젝트 ID로 조회
    const response = await request.get(
        `/projects/${createdProject.id}`
    );

    //3. Then 응답 검증
    expect(response.status()).toBe(200);

    const body = await response.json();

    expect(body.id).toBe(createdProject.id);
    expect(body.name).toBe(projectName);
});

test('PROJECT-003 존재하지 않는 프로젝트 조회', async ({request}) => {
    const response = await request.get('/projects/999999');

    expect(response.status()).toBe(404);

    const body = await response.json();

    expect(body.message).toBe('Project not found');
});