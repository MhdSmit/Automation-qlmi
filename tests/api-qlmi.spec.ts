import { test, expect } from '@playwright/test';
import fs from 'fs';
import axios from 'axios';

const BASE_URL = 'https://api.qlmi.ai/api/auth';
let token: string;

// Slack Webhook URL
const SLACK_WEBHOOK_URL = 'https://hooks.slack.com/services/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';

// Send Slack notification on failure
async function sendSlackNotification(subject: string, error: string) {
  try {
    await axios.post(SLACK_WEBHOOK_URL, {
      text: `*${subject}*\n${error}`,
    });
  } catch (err) {
    //console.error('Failed to send Slack notification:', err.message);
  }
}

// Wrapper for error handling
async function handleTestError(testName: string, testFn: () => Promise<void>) {
  try {
    await testFn();
  } catch (error: any) {
    const errorMessage = `${testName} failed: ${error.message}`;
    //logError(errorMessage);
    await sendSlackNotification(`${testName} Failed`, errorMessage);
    throw error; // Re-throw to fail the test in Playwright
  }
}

// Login API Test
test('Login API Test', async ({ request }) => {
  await handleTestError('Login API Test', async () => {
    const response = await request.post(`${BASE_URL}/login`, {
      data: {
        email: 'mohammad.smit+prod6@locai.ai',
        password: 'MS@28033ms',
      },
    });

    expect(response.status()).toBe(200);

    const responseBody = await response.json();
    expect(responseBody).toHaveProperty('message', 'User logged in successfully');
    expect(responseBody.data).toBeTruthy();

    token = responseBody.data;
    console.log('Token:', token);
  });
});

// Check API Test
test('Check API Test', async ({ request }) => {
  await handleTestError('Check API Test', async () => {
    const response = await request.post('https://llm.qlmi.ai/v1/check', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: {
        text: 'مربحا',
        model: 'gpt-4o',
      },
    });

    expect(response.status()).toBe(200);

    const responseBody = await response.json();
    expect(responseBody).toHaveProperty('alerts');
    expect(responseBody.alerts).toBeInstanceOf(Array);
    expect(responseBody.alerts.length).toBeGreaterThan(0);
  });
});

// Tashkeel API Test
test('Tashkeel API Test', async ({ request }) => {
  await handleTestError('Tashkeel API Test', async () => {
    const response = await request.post('https://llm.qlmi.ai/v1/tashkeel', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: {
        text: 'حتى الفنون',
        model: 'gpt-4o',
      },
    });

    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    expect(responseBody).toHaveProperty('tashkeel');
    expect(responseBody.tashkeel).toBeTruthy();
  });
});

// Summarize API Test
test('Summarize API Test', async ({ request }) => {
  await handleTestError('Summarize API Test', async () => {
    const response = await request.post('https://llm.qlmi.ai/v1/summarize', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: {
        text: 'كيف الحال يا أصدقائي الأعزاء؟',
        model: 'gpt-4o',
      },
    });

    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    expect(responseBody).toHaveProperty('summarized');
    expect(responseBody.summarized).toBeTruthy();
  });
});

// Rephrase API Test
test('Rephrase API Test', async ({ request }) => {
  await handleTestError('Rephrase API Test', async () => {
    const response = await request.post('https://llm.qlmi.ai/v1/rephrase', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: {
        text: 'كيف الحال يا أصدقائي الأعزاء؟',
        model: 'gpt-4o',
      },
    });

    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    expect(responseBody).toHaveProperty('rephrased');
    expect(responseBody.rephrased).toBeTruthy();
  });
});