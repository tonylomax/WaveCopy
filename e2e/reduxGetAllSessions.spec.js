describe('Check that Redux can subscribe to changing data in Firestore', () => {
  exampleEmail = 't@t.com';
  examplePassword = 'asdasd';
  beforeEach(async () => {
    await device.terminateApp();
    await device.launchApp();
    await device.reloadReactNative();
  });
  it('Should update the app screen with live session data from Firestore', async () => {
    await element(by.id('email')).typeText(exampleEmail);
    await element(by.id('password')).typeText(examplePassword);
    await element(by.id('submit-login-details')).tap();
    await waitFor(element(by.id('SessionsList')))
      .toExist()
      .withTimeout(10000);
    await expect(element(by.id('navigate-to-profile-button'))).toExist();
    await element(by.id('navigate-to-profile-button')).tap();
    await expect(element(by.id('signOutButton'))).toExist();
    await element(by.id('signOutButton')).tap();
    await expect(element(by.id('email'))).toExist();
  });
});
