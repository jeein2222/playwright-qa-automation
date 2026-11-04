import { test, expect } from '@playwright/test';

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