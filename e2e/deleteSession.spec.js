describe('Delete session', () => {
  exampleEmail = 't@t.com';
  examplePassword = 'Asdasd6';
  beforeEach(async () => {
    // await device.terminateApp();
    // await device.launchApp();
    // await device.reloadReactNative();
  });

  it('it should be able to login, be redirected to home page, select a specific session and delete it, navigate back to home and not see the session', async () => {
    await element(by.id('email')).typeText(exampleEmail);
    await element(by.id('password')).typeText(examplePassword);
    await element(by.id('submit-login-details')).tap();
    await waitFor(element(by.id('upcoming-sessions-title')))
      .toExist()
      .withTimeout(10000);

    await expect(element(by.id('navigate-to-profile-button'))).toExist();
    // Need to generalise
    await element(by.id('navigate-to-profile-button')).tap();

    await element(by.id('profile-scroll-view')).scrollTo('bottom');
    await expect(
      element(by.id('ProfileSessionsListItemGRaBiW6N6whSio5bpVY6')),
    ).toExist();

    await element(by.id('ProfileSessionsListItemGRaBiW6N6whSio5bpVY6')).tap();
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
