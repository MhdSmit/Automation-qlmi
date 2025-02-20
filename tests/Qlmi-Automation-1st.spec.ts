import { test, expect, Page } from '@playwright/test';

const baseURL = process.env.BASE_URL; // Get the base URL from environment variables
const login = async (page: Page, email: string, password: string) => {
    await page.getByPlaceholder('أدخل بريدك الإلكتروني').click();
    await page.getByPlaceholder('أدخل بريدك الإلكتروني').fill(email);
    await page.getByPlaceholder('كلمة المرور').click();
    await page.getByPlaceholder('كلمة المرور').fill(password);
    await page.getByRole('button', { name: 'تسجيل الدخول' }).click();
  };
  const logout = async (page: Page) => {
    await page.getByRole('button', { name: 'logout' }).click();
    await page.waitForTimeout(1000); 
    await expect(page.getByRole('main')).toContainText('تسجيل الدخول');
    await page.close();
  };
    
  test('Login with empty fields should show validation errors', async ({ page }) => {
    if (!baseURL) throw new Error('Base URL is not set');
      await page.goto(baseURL);
    await login(page, '', '');
    await expect(page.locator('form')).toContainText('البريد الإلكتروني غير صالح');
    await expect(page.locator('form')).toContainText('يرجى تقديم كلمة مرور صالحة');
    await page.close();
  });

  test('Login with non-existent email should show user not found error', async ({ page }) => {
    if (!baseURL) throw new Error('Base URL is not set');
      await page.goto(baseURL);
    let random_id = Math.random();
    await login(page, `Test${random_id}@testy.com`, 'MS@803mms');
    await expect(page.locator('form')).toContainText('المستخدم غير موجود');
    await page.close();
  });

  test('Login with correct credentials should navigate to dashboard', async ({ page }) => {
    if (!baseURL) throw new Error('Base URL is not set');
      await page.goto(baseURL);
    await login(page, 'mohammad.smit+23@locai.ai', 'MS@28033ms');
    await page.waitForTimeout(2000);
    await expect(page.getByRole('main')).toContainText('تحليلات الاستخدام');
    await page.close();
  });
  // Test: Weak password
  test('Login with weak password should show error', async ({ page }) => {
    if (!baseURL) throw new Error('Base URL is not set');
      await page.goto(baseURL);
    await login(page, 'mohammad.smit+23@locai.ai', 'WrongPassword123');
    await expect(page.locator('form')).toContainText('يرجى تقديم كلمة مرور صالحة: 8 أحرف على الأقل، حرف كبير واحد على الأقل، رقم واحد وحرف خاص واحد');
    await page.close();
  });
  // Test: Wrong password
  test('Login with incorrect password should show error', async ({ page }) => {
    if (!baseURL) throw new Error('Base URL is not set');
      await page.goto(baseURL);
    await login(page, 'mohammad.smit+23@locai.ai', 'WrongPassword@123');
    await expect(page.locator('form')).toContainText('البريد الالكتروني أو كلمة مرور غير صحيحة');
    await page.close();
  });

  test('check language and filters', async ({ page }) => {
    if (!baseURL) throw new Error('Base URL is not set');
    await page.goto(baseURL);
    login(page, 'mohammad.smit+23@locai.ai', 'MS@28033ms');
    await expect(page.getByRole('main')).toContainText('تحليلات الاستخدام');
    //Change language
    await page.locator('button').filter({ hasText: 'العربية' }).click();
    await page.waitForTimeout(1000); 
    await page.getByLabel('English').click();
    await page.waitForTimeout(1000); 
    await expect(page.getByRole('main')).toContainText('My Analytics');
    await page.waitForTimeout(1000); 
    //Check filters En
    await page.locator('button').filter({ hasText: 'Last 7 days' }).click();
    await page.getByText('Last 30 days').click();
    await page.waitForTimeout(1000); 
    await page.locator('button').filter({ hasText: 'Last 30 days' }).click();
    await page.getByText('Last 365 days').click();
    await page.waitForTimeout(1000); 
    //Change language
    await page.locator('button').filter({ hasText: 'English' }).click();
    await page.getByLabel('العربية').locator('span').nth(1).click();
    await page.waitForTimeout(1000); 
    await expect(page.getByRole('main')).toContainText('تحليلات الاستخدام');
    //Check filters Ar
    await expect(page.locator('button').filter({ hasText: 'اخر 365 يوم' })).toBeVisible();
    await expect(page.locator('main')).toContainText('اخر 365 يوم');
    await page.locator('html').click();
    await page.waitForTimeout(1000); 

    await logout(page);
    await page.close();
  });
  test('Browse Apps page', async ({ page }) => {
    if (!baseURL) throw new Error('Base URL is not set');
      await page.goto(baseURL);
    login(page, 'mohammad.smit+23@locai.ai', 'MS@28033ms');
    //Apps page
    await page.getByRole('link', { name: 'apps تطبيقاتي' }).click();
    await page.locator('div').filter({ hasText: 'إضافات المتصفحقلمي لمتصفح' }).nth(2).click();
    await page.waitForTimeout(1000); 
    await expect(page.getByRole('main')).toContainText('إضافات المتصفح');
    
    await logout(page);
    await page.close();
  });
  test('Update profile info', async ({ page }) => {
    if (!baseURL) throw new Error('Base URL is not set');
      await page.goto(baseURL);
    login(page, 'mohammad.smit+23@locai.ai', 'MS@28033ms');
    await expect(page.getByRole('main')).toContainText('تحليلات الاستخدام');
    await page.getByRole('link', { name: 'settings الإعدادات' }).click();
    await expect(page.getByLabel('التفاصيل الشخصية').getByRole('heading')).toContainText('المعلومات الشخصية');
    await page.getByPlaceholder('أدخل اسمك').click();
    await page.getByPlaceholder('أدخل اسمك').fill('mohammad.smit+18');
    await page.getByRole('button', { name: 'حفظ' }).click();
    await page.waitForTimeout(1000); 
    await expect(page.getByRole('main')).toContainText('mohammad.smit+18');
    await page.getByPlaceholder('أدخل اسمك').click();
    await page.getByPlaceholder('أدخل اسمك').fill('mohammad.smit+19');
    await page.waitForTimeout(1000);
    await page.getByRole('button', { name: 'حفظ' }).click();
    await page.waitForTimeout(1000); 
    await expect(page.getByRole('main')).toContainText('mohammad.smit+19');

    await logout(page);
    await page.close();
  });
  test('Check if the tour appearing to users', async ({ page }) => {
    if (!baseURL) throw new Error('Base URL is not set');
      await page.goto(baseURL);
    login(page, 'mohammad.smit+tour1@locai.ai', 'MS@28033ms');
    await page.getByRole('heading', { name: 'ابدأ مع قلمي بسرعة وسهولة' }).click();
    await expect(page.getByRole('main')).toContainText('ابدأ مع قلمي بسرعة وسهولة.');
    await logout(page);
    await page.close();
  });
  test('Delete an account', async ({ page }) => {
    if (!baseURL) throw new Error('Base URL is not set');
      await page.goto(baseURL);
    login(page, 'mohammad.smit+tour@locai.ai', 'MS@28033ms');
    await page.getByRole('link', { name: 'settings الإعدادات' }).click();
    await page.getByRole('button', { name: 'حذف الحساب' }).click();
    await expect(page.getByLabel('هل أنت متأكد من رغبتك في حذف حسابك؟')).toContainText('هل أنت متأكد من رغبتك في حذف حسابك؟');
    await page.getByRole('button', { name: 'حذف الحساب' }).click();
    await page.close();
  });
  test('Restore an account', async ({ page }) => {
    if (!baseURL) throw new Error('Base URL is not set');
      await page.goto(baseURL);
    login(page, 'mohammad.smit+tour@locai.ai', 'MS@28033ms');
    await expect(page.getByLabel('تم جدولة حذف حسابك. هل ترغب في استعادته؟')).toContainText('تم جدولة حذف حسابك. هل ترغب في استعادته؟');
    await page.getByRole('button', { name: 'استعادة الحساب' }).click();
    await expect(page.getByRole('main')).toContainText('تحليلات الاستخدام');
    await page.close();
  });
  