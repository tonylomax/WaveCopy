describe('Test coordinator function', () => {
  exampleEmail = 't@t.com';
  examplePassword = 'Asdasd6';

  it('it should be able to login, be redirected to home page, go to a session', async () => {
    await element(by.id('email')).typeText(exampleEmail);
    await element(by.id('password')).typeText(examplePassword);
    await element(by.id('submit-login-details')).tap();
    await waitFor(element(by.id('upcoming-sessions-title')))
      .toExist()
      .withTimeout(10000);

    await waitFor(element(by.id('SessionsListItemQtcdCWD25v2jDqMAO2FU')))
      .toExist()
      .withTimeout(10000);

    await element(by.id('SessionsListItemQtcdCWD25v2jDqMAO2FU')).tap();

    await waitFor(element(by.id('mentors-accordian')))
      .toExist()
      .withTimeout(10000);

    await element(by.id('mentors-accordian')).tap();

    await waitFor(
      element(by.id('removeAsMentorButtonItsaweTMcYYxY2S16gDAz7m6v0T2')),
    )
      .toExist()
      .withTimeout(10000);

    await element(
      by.id('removeAsMentorButtonItsaweTMcYYxY2S16gDAz7m6v0T2'),
    ).tap();

    await element(by.id('header-back')).tap();

    await waitFor(element(by.id('SessionsListItemVolNumQtcdCWD25v2jDqMAO2FU')))
      .toHaveText('Volunteers: 0/3')
      .withTimeout(10000);

    await element(by.id('navigate-to-profile-button')).tap();

    await expect(element(by.id('firestoreName'))).toExist();
    await element(by.id('signOutButton')).tap();
    await expect(element(by.id('email'))).toExist();
  });
});
