import { test, expect } from '@playwright/test';
import { testConfig } from '../../config/testConfig';
import { LoginPage } from '../../pages/LoginPage';


test('LOGIN-001 정상 로그인', async ({ page })=> {
  const loginPage = new LoginPage(page);

  //1.로그인 페이지 접속
  await loginPage.goto();

  //2. 로그인 수행
  await loginPage.login(
    testConfig.id,
    testConfig.password
  );

  //3. 기대 결과 검증
  //toHaveURL : 로그인 후 현재 URL이 대시보드 경로와 일치하는지 확인.
  //await를 쓰는 이유 : 기대 URL이 될 때가지 지정된 제한 시간 안에서 조건을 재검사한다.
  //await는 그 검증 Promise가 완료될 때까지 테스트의 다음 단계 진행을 기다리는 역할.
  await expect(page).toHaveURL(/\/app\/dashboard/);

  //toBeVisible : 대시보드의 특정 요소가 실제로 화면에 표시되는지 확인.
  await expect(
    page.getByRole('heading', {
      name:'나의 프로젝트',
      exact: true
    })
  ).toBeVisible();

})