import { test, expect } from '@playwright/test';
import { create } from 'node:domain';

test('PROJECT-004 정상 프로젝트 이름 수정', async ({ request }) => {

  // Given: 수정할 프로젝트 생성
  const oldName = `OldProject-${Date.now()}`;
  const newName = `NewProject-${Date.now()}`;

  const createResponse = await request.post('/projects', {
    data: { name: oldName }
  });

  expect(createResponse.status()).toBe(201);

  const createdProject = await createResponse.json();
  const projectId = createdProject.id;

  // When: 프로젝트 이름 수정
  const updateResponse = await request.put(
    `/projects/${projectId}`,
    {
      data: { name: newName }
    }
  );

  // Then: 수정 API 응답 검증
  expect(updateResponse.status()).toBe(200);

  const updatedProject = await updateResponse.json();

  expect(updatedProject.id).toBe(projectId);
  expect(updatedProject.name).toBe(newName);

  // 실제 저장된 데이터 재조회
  const getResponse = await request.get(
    `/projects/${projectId}`
  );

  expect(getResponse.status()).toBe(200);

  const project = await getResponse.json();

  expect(project.name).toBe(newName);
  expect(project.name).not.toBe(oldName);
});

test('PROJECT-005 존재하지 않는 프로젝트 수정', async ({request}) => {
  // When: 존재하지 않는 프로젝트 ID로 수정 요청
  const response = await request.put('/projects/999999', {
    data: {
      name: 'NewProject'
    }
  });

  // Then: 404 응답 검증
  expect(response.status()).toBe(404);

  const body = await response.json();

  expect(body.message).toBe('Project not found');
});

test('PROJECT-006 빈 프로젝트 이름으로 수정', async ({request}) => {
  // Given: 수정할 프로젝트 생성
  const createResponse = await request.post('/projects', {
    data: {
      name: `Project-${Date.now()}`
    }
  });

  expect(createResponse.status()).toBe(201);

  const createdProject = await createResponse.json();
  const projectId = createdProject.id;
  const originalName = createdProject.name;

  // When: 빈 문자열로 수정 요청
  const response = await request.put(
    `/projects/${projectId}`,
    {
      data:{
        name: ''
      }
    }
  );

  // Then: 400 응답 검증
  expect(response.status()).toBe(400);

  const body = await response.json();

  expect(body.message).toBe('Project name is required');

  // And: 기존 프로젝트 이름이 유지되는지 확인
  const getResponse = await request.get(`/projects/${projectId}`);

  expect(getResponse.status()).toBe(200);

  const project = await getResponse.json();

  expect(project.name).toBe(originalName);
});

test('PROJECT-007 중복된 프로젝트 이름으로 수정', async ({request}) => {
  // Given: 프로젝트 A와 B 생성
  const uniqueId = `${Date.now()}-${Math.random()}`;

  const createA = await request.post('/projects', {
    data: {
      name: `ProjectA-${uniqueId}`
    }
  });

   const createB = await request.post('/projects', {
    data: {
      name: `ProjectB-${uniqueId}`
    }
  });

  expect(createA.status()).toBe(201);
  expect(createB.status()).toBe(201);

  const projectA = await createA.json();
  const projectB = await createB.json();

  // When: B의 이름을 A의 이름으로 수정
  const updateResponse = await request.put(
    `/projects/${projectB.id}`,
    {
      data: {
        name: projectA.name
      }
    }
  );

  // Then: 중복 이름이므로 수정 실패
  expect(updateResponse.status()).toBe(409);

  const body = await updateResponse.json();

  expect(body.message).toBe('Duplicate project name');

  // And: B의 기존 이름이 유지되는지 확인
  const getResponse = await request.get(
    `/projects/${projectB.id}`
  );

  expect(getResponse.status()).toBe(200);

  const project = await getResponse.json();

  expect(project.name).toBe(projectB.name);
});