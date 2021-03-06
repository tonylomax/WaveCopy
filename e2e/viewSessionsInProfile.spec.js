describe('Test profile', () => {
  exampleEmail = 'a@a.com';
  examplePassword = 'Asdasd6';
  beforeEach(async () => {
    // await device.terminateApp();
    // await device.launchApp();
    // await device.reloadReactNative();
  });

  it('it should be able to login, be redirected to home page, navigate to profile page, view an upcoming session and log out back to the login page', async () => {
    await element(by.id('email')).typeText(exampleEmail);
    await element(by.id('password')).typeText(examplePassword);
    await element(by.id('submit-login-details')).tap();
    await waitFor(element(by.id('upcoming-sessions-title')))
      .toExist()
      .withTimeout(10000);
    await expect(element(by.id('navigate-to-profile-button'))).toExist();

    await element(by.id('navigate-to-profile-button')).tap();

    await waitFor(element(by.id('ProfileSessionsListItemQtcdCWD25v2jDqMAO2FU')))
      .toExist()
      .withTimeout(10000);

    await expect(element(by.id('firestoreName'))).toExist();
    await element(by.id('signOutButton')).tap();
    await expect(element(by.id('email'))).toExist();
  });
});
