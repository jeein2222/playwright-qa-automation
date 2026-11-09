import {test, expect} from '@playwright/test';

test('PROJECT-001 정상 프로젝트 생성', async ({request}) => {
    //1. 중복 방지를 위한 고유 프로젝트 이름
    const projectName = `TestProject-${Date.now()}`;

    //2. 프로젝트 생성 요청
    const response = await request.post('/projects', {
        data:{
            name: projectName
        }
    });

    //3. HTTP 상태 코드 확인
    expect(response.status()).toBe(201);

    //4. 응답 데이터 확인
    const body = await response.json();

    expect(body.id).toEqual(expect.any(Number));
    expect(body.name).toBe(projectName);

    //5. 실제 생성 여부 확인
    const listResponse = await request.get('/projects');

    expect(listResponse.status()).toBe(200);

    const projects = await listResponse.json();

    const matchedProjects = projects.filter(
        (project : {id:number; name:string}) =>
            project.id === body.id && project.name === projectName
    );

    expect(matchedProjects).toHaveLength(1);
});