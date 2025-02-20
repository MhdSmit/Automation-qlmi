import { defineConfig } from '@playwright/test';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const ENV = process.env.ENV || 'dev'; // Default to 'dev' if not set
const BASE_URLS: Record<string, string> = {
  dev: process.env.DEV_URL || 'https://dev.qlmi.ai',
  stage: process.env.STAGE_URL || 'https://stg.qlmi.ai',
  production: process.env.PROD_URL || 'https://app.qlmi.ai',
};

// Set the base URL dynamically
process.env.BASE_URL = BASE_URLS[ENV];

export default defineConfig({
  testDir: './tests',
  use: {
    browserName: 'chromium',
    headless: true,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  reporter: [['html', { outputFolder: 'playwright-report' }]],
});
