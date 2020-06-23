describe('Check that Redux can subscribe to changing data in Firestore', () => {
  exampleEmail = 't@t.com';
  examplePassword = 'asfsaf221@212sf';
  beforeEach(async () => {
    await device.reloadReactNative();
  });
  it('Should update the app screen with live session data from Firestore', async () => {
    await element(by.id('email')).typeText(exampleEmail);
    await element(by.id('password')).typeText(examplePassword);
    await element(by.id('submit-login-details')).tap();
    await expect(element(by.id('SessionsList'))).toExist();
    // await expect(element(by.id('SessionsListItem'))).toExist();
    await waitFor(element(by.id('SessionsListItem')))
      .toBeVisible()
      .withTimeout(2000);
  });
});
