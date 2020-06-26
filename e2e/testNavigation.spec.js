describe('Example', () => {
  exampleEmail = 't@t.com';
  examplePassword = 'asdasd';
  beforeEach(async () => {
    await device.terminateApp();
    await device.launchApp();
    await device.reloadReactNative();
  });

  it('it should be able to login, be redirected to home page and able to navigate to profile page', async () => {
    await element(by.id('email')).typeText(exampleEmail);
    await element(by.id('password')).typeText(examplePassword);
    await element(by.id('submit-login-details')).tap();
    await waitFor(element(by.id('upcoming-sessions-title')))
      .toExist()
      .withTimeout(4000);
    await element(by.id('navigate-to-profile-button')).tap();
    await waitFor(element(by.id('bio')))
      .toExist()
      .withTimeout(10000);

    await element(by.id('signOutButton')).tap();
    await expect(element(by.id('email'))).toExist();
  });
});
