describe('Edit profile', () => {
  exampleEmail = 'j@j.com';
  examplePassword = 'asdasd';
  updateBioText = 'New bio information created by Detox test\n';

  beforeEach(async () => {
    // await device.terminateApp();
    // await device.launchApp();
    // await device.reloadReactNative();
  });

  it('it should be able to login, navigate to the profile screen and update profile elements', async () => {
    await element(by.id('email')).typeText(exampleEmail);
    await element(by.id('password')).typeText(examplePassword);
    await element(by.id('submit-login-details')).tap();
    await waitFor(element(by.id('upcoming-sessions-title')))
      .toExist()
      .withTimeout(10000);
    await expect(element(by.id('navigate-to-profile-button'))).toExist();

    await element(by.id('navigate-to-profile-button')).tap();
    await expect(element(by.id('firestoreName'))).toExist();

    await waitFor(element(by.id('profilePic')))
      .toExist()
      .withTimeout(10000);

    await waitFor(element(by.id('bio')))
      .toExist()
      .withTimeout(10000);

    await waitFor(element(by.id('bio')))
      .toExist()
      .withTimeout(10000);

    await waitFor(element(by.id('editBioButton')))
      .toExist()
      .withTimeout(10000);

    await element(by.id('editBioButton')).tap();

    await waitFor(element(by.id('editBio')))
      .toExist()
      .withTimeout(10000);

    await element(by.id('editBio')).clearText();
    await element(by.id('editBio')).typeText(updateBioText);

    await waitFor(element(by.id('confirmBioUpdate')))
      .toExist()
      .withTimeout(10000);

    await element(by.id('confirmBioUpdate')).tap();

    await waitFor(element(by.id('uploadNewProfilePic')))
      .toExist()
      .withTimeout(10000);

    await element(by.id('signOutButton')).tap();
    await expect(element(by.id('email'))).toExist();
  });
});
