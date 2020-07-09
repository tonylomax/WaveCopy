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

    // Need to generalise
    await element(by.id('SessionsListItemQtcdCWD25v2jDqMAO2FU')).tap();
    // Click the button that says delete
    await element(by.id('delete-session-button')).tap();
    // Confirm deletion of session
    await element(by.id('yesButtonChoicePopup')).tap();
    // expect to redirect back to home.
    await waitFor(element(by.id('upcoming-sessions-title')))
      .toExist()
      .withTimeout(3000);
  });
});
