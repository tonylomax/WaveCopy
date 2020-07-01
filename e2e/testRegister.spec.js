describe('Test register', () => {
  exampleEmail = 'j@j.com';
  examplePassword = 'asdasd';
  beforeEach(async () => {
    await device.terminateApp();
    await device.launchApp();
    await device.reloadReactNative();
  });

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

    await waitFor(element(by.id('registerButton')))
      .toExist()
      .withTimeout(10000);

    await element(by.id('registerButton')).tap();

    await waitFor(element(by.id('personToRegister129520710')))
      .toExist()
      .withTimeout(10000);

    if (
      await waitFor(element(by.id('personToRegister129520710')))
        .toHaveText('Charlotte Viqueria true')
        .withTimeout(10000)
    ) {
      attended = true;
    } else attended = false;

    await element(by.id('personToRegisterButton129520710')).tap();

    await waitFor(element(by.id('personToRegister129520710')))
      .toHaveText(`Charlotte Viqueria ${attended}`)
      .withTimeout(10000);

    await element(by.id('navigate-to-profile-button')).tap();
    await expect(element(by.id('firestoreName'))).toExist();
    await element(by.id('signOutButton')).tap();
    await expect(element(by.id('email'))).toExist();
  });
});
