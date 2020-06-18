describe('Example', () => {
  beforeEach(async () => {
    await device.reloadReactNative();
  });

  const exampleEmail = 'test@test.com';
  const examplePassword = '!wqwr#rewrew231';
  const exampleName = 'Joe Bloggs';
  it('it should be able to submit email and password', async () => {
    await element(by.id('email')).typeText(exampleEmail);
    // await element(by.id('password')).typeText(examplePassword)
    // await element(by.id('confirmpassword')).typeText(examplePassword)
    // await element(by.id('fullname')).typeText(exampleName)
    // await element(by.id('submit')).tap()
  });
});
