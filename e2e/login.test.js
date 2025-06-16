describe('Login Flow', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should login successfully with valid credentials', async () => {
    // Wait for login screen to appear
    await waitFor(element(by.text('Entrar')))
      .toBeVisible()
      .withTimeout(5000);

    // Fill in credentials
    await element(by.id('email-input')).typeText('demo@xp.com');
    await element(by.id('password-input')).typeText('password123');

    // Tap login button
    await element(by.text('Entrar')).tap();

    // Verify dashboard appears
    await waitFor(element(by.text('Dashboard')))
      .toBeVisible()
      .withTimeout(10000);
  });

  it('should show error for invalid credentials', async () => {
    // Wait for login screen
    await waitFor(element(by.text('Entrar')))
      .toBeVisible()
      .withTimeout(5000);

    // Fill in invalid credentials
    await element(by.id('email-input')).typeText('invalid@email.com');
    await element(by.id('password-input')).typeText('wrongpassword');

    // Tap login button
    await element(by.text('Entrar')).tap();

    // Verify error message appears
    await waitFor(element(by.text('Email ou senha incorretos')))
      .toBeVisible()
      .withTimeout(5000);
  });
});