import { defineConfig, devices } from '@playwright/test';
/*
  defineConfig : Playwright 설정을 작성할 때 사용하는 함수. TypeScript에서 설정을 검사하고 자동 완성 기능을 활용하기 좋다.
  devices : Playwright가 제공하는 브라우저 및 기기 환경의 사전 정의된 설정들.
*/

/**
 * Playwright 테스트의 전체 실행 환경을 설정하는 파일
 * - 테스트 파일이 어디 있는지
 * - 어떤 브라우저에서 실행할지
 * - 테스트를 동시에 몇 개 실행할지
 * - 실패하면 재시도할지
 * - 결과 보고서를 어떤 형식으로 만들지
 * - 테스트할 서버를 자동으로 실행할지
 */

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * See https://playwright.dev/docs/test-configuration.
 */
//현재 파일에서 정의한 설정을 Playwright가 가져다 사용할 수 있도록 내보내는 것. 
export default defineConfig({
  testDir: './tests', 
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('')`. */
    // baseURL: 'http://localhost:3000',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      testIgnore: /tests\/api\/mock\//,
      use: { ...devices['Desktop Chrome'] },
    },

    {
      name: 'firefox',
      testIgnore: /tests\/api\/mock\//,
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      testIgnore: /tests\/api\/mock\//,
      use: { ...devices['Desktop Safari'] },
    },

    {
      name:'mock-api',
      testMatch:  /tests\/api\/mock\/.*\.spec\.ts/,
      use: {
        baseURL: 'http://127.0.0.1:3001'
      }
    }

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  webServer: {
    command: 'node mock-api/server.js',
    url: 'http://127.0.0.1:3001/projects',
    reuseExistingServer: false,
    timeout: 10000
  },
});
