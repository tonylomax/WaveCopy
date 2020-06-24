describe('Example', () => {
  exampleEmail = 't@t.com';
  examplePassword = 'asfsaf221@212sf';
  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should be able to open and close a modal', async () => {
    await element(by.id('email')).typeText(exampleEmail);
    await element(by.id('password')).typeText(examplePassword);
    await element(by.id('submit-login-details')).tap();
    await element(by.id('modalButton')).tap();
    await expect(element(by.id('choicePopup'))).toBeNotVisible();
    await element(by.id('yesButtonChoicePopup')).tap();
    await expect(element(by.id('choicePopup'))).toBeNotVisible();
  });
});
