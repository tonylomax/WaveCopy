describe('Delete session', () => {
  exampleEmail = 't@t.com';
  examplePassword = 'Asdasd6';
  const sessionToEdit = 'QtcdCWD25v2jDqMAO2FU';
  beforeEach(async () => {
    // await device.terminateApp();
    // await device.launchApp();
    // await device.reloadReactNative();
  });

  it('it should be able to login, be redirected to home page, select a specific session and edit it, navigate back to home and see the session is edited', async () => {
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
      element(by.id(`ProfileSessionsListItem${sessionToEdit}`)),
    ).toExist();

    await element(by.id(`ProfileSessionsListItem${sessionToEdit}`)).tap();
    await element(by.id(`edit-session-button`)).tap();
    // Need to enter the flow of create Session
    await expect(element(by.id('session-details-scroll-view'))).toExist();
  });
});
