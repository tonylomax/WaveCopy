describe('Example', () => {
  exampleEmail = 't@t.com';
  examplePassword = 'asfsaf221@212sf';
  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('it should be able to login, be redirected to profile page', async () => {
    await element(by.id('email')).typeText(exampleEmail);
    await element(by.id('password')).typeText(examplePassword);
    await element(by.id('submit-login-details')).tap();
    await expect(element(by.id('upcoming-sessions-title'))).toExist();
    await element(by.id('navigate-to-settings-button')).tap();
    await expect(element(by.id('bio'))).toExist();
  });
});
