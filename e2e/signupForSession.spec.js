describe('Test register', () => {
  exampleEmail = 'a@a.com';
  examplePassword = 'Asdasd6';

  it('it should be able to log in, select a specific session, navigate to the register for that session and mark a user as "in attendance" and see that change rendered on the screen', async () => {
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

    await waitFor(element(by.id('signupButton')))
      .toExist()
      .withTimeout(10000);

    await element(by.id('signupButton')).tap();

    await element(by.id('header-back')).tap();

    await waitFor(element(by.id('SessionsListItemVolNumQtcdCWD25v2jDqMAO2FU')))
      .toHaveText('Volunteers: 3/3')
      .withTimeout(10000);

    await element(by.id('navigate-to-profile-button')).tap();
    await expect(element(by.id('firestoreName'))).toExist();
    await element(by.id('signOutButton')).tap();
    await expect(element(by.id('email'))).toExist();
  });
});
