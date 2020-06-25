describe('Check that Redux can subscribe to changing data in Firestore', () => {
  exampleEmail = 't@t.com';
  examplePassword = 'asdasd';
  beforeEach(async () => {
    await device.reloadReactNative();
  });
  it('Should update the app screen with live session data from Firestore', async () => {
    await element(by.id('email')).typeText(exampleEmail);
    await element(by.id('password')).typeText(examplePassword);
    await element(by.id('submit-login-details')).tap();

    // await element(by.id('SessionList')).toExist();
    // await element(by.id('SessionsListItem')).toExist();

    await waitFor(element(by.id('SessionsList')))
      .toBeVisible()
      .withTimeout(10000);
    // await waitFor(element(by.id('SessionsListItem')))
    //   .toExist()
    //   .withTimeout(4000);
  });
});
