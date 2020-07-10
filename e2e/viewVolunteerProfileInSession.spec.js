describe('Test session', () => {
  exampleEmail = 't@t.com';
  examplePassword = 'Asdasd6';
  beforeEach(async () => {
    // await device.terminateApp();
    // await device.launchApp();
    // await device.reloadReactNative();
  });

  it('it should be able to login, be redirected to home page, view a specific session, select the dropdown of volunteers, click on a volunteer and view specific information about that volunteer ', async () => {
    await element(by.id('email')).typeText(exampleEmail);
    await element(by.id('password')).typeText(examplePassword);
    await element(by.id('submit-login-details')).tap();
    await waitFor(element(by.id('upcoming-sessions-title')))
      .toExist()
      .withTimeout(10000);

    await expect(element(by.id('upcoming-sessions-title'))).toExist();

    await expect(element(by.id('SessionsList'))).toExist();

    await waitFor(element(by.id('SessionsListItemIHyEl8apAEKcMyt4ms0b')))
      .toExist()
      .withTimeout(10000);

    await element(by.id('SessionsListItemIHyEl8apAEKcMyt4ms0b')).tap();

    await expect(element(by.id('mentors-accordian'))).toExist();

    await element(by.id('mentors-accordian')).tap();

    await waitFor(
      element(by.id('session-accordion-mentorItsaweTMcYYxY2S16gDAz7m6v0T2')),
    )
      .toExist()
      .withTimeout(10000);

    //unable to test further as component does not have test id prop
  });
});
