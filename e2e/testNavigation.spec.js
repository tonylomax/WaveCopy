describe('Example', () => {
  beforeEach(async () => {
    await device.reloadReactNative();
  });
  const exampleEmail = 'test@test.com';
  const examplePassword = '!wqwr#rewrew231';

  it('it should be able to login, be redirected to profile page', async () => {
    await element(by.id('email')).typeText(exampleEmail);
    await element(by.id('password')).typeText(examplePassword);
    await element(by.id('submit-login-details')).tap();
    await expect(element(by.id('upcoming-sessions-title'))).toExist();
  });
});
