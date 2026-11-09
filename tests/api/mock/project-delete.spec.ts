import {test, expect} from '@playwright/test';
import { create } from 'node:domain';

test('PROJECT-008 프로젝트 삭제 및 재조회 검증', async({request}) => {
    // Given : 삭제할 프로젝트 생성
    const projectName = `DeleteTest-${Date.now()}`;

    const createResponse = await request.post('/projects', {
        data: { name:projectName }
    });

    expect(createResponse.status()).toBe(201);

    const createdProject = await createResponse.json();
    const projectId = createdProject.id;

    // When : 프로젝트 삭제
    const deleteResponse = await request.delete(
    `/projects/${projectId}`
    );

    // Then : 삭제 API 응답 검증
    expect(deleteResponse.status()).toBe(204);

    // 204 응답에는 Body가 없어야 함
    expect(await deleteResponse.body()).toHaveLength(0);

    // And : 삭제한 프로젝트를 다시 조회 PROJECT-009
    const getResponse = await request.get(
        `/projects/${projectId}`
    );

    expect(getResponse.status()).toBe(404);

    const body = await getResponse.json();

    expect(body.message).toBe('Project not found');
});

test('PROJECT-010 존재하지 않는 프로젝트 삭제', async({ request })=> {
    const response = await request.delete('/projects/999999');

    expect(response.status()).toBe(404);

    const body = await response.json();

    expect(body.message).toBe('Project not found');
});
