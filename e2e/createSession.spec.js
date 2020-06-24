describe('Create a surf session', () => {
  exampleEmail = 't@t.com';
  examplePassword = 'asfsaf221@212sf';
  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('It should be able to navigate to create session page, fill in the form, select attendees and create a session', async () => {
    // Login,
    // Navigate to create session
    // Fill out create session form
    // submit the form
    // Check that your back on the session page
    // and check that the data is correct
    // Press the tick button
    // select the 'yes' to create the session
    // Ensure you're redirected to the session page

    await element(by.id('email')).typeText(exampleEmail);
    await element(by.id('password')).typeText(examplePassword);
    await element(by.id('submit-login-details')).tap();
    await element(by.id('navigate-to-create-session')).tap();
    await expect(element(by.id('create-session-title'))).toExist();
    await expect(element(by.id('type-of-session'))).toExist();

    // Only available on ios
    await element(by.id('type-of-session')).setColumnToValue(0, 'Surf therapy');

    // Only available on ios
    await element(by.id('date-of-session')).setDatePickerDate(
      '2023-02-06',
      'yyyy-MM-dd',
    );
    // Only available on ios
    await element(by.id('location-of-session')).setColumnToValue(
      0,
      'Cornwall - Fistral',
    );
    // Only available on ios
    await element(by.id('session-details-scroll-view')).scrollTo('bottom');
    await element(by.id('number-of-volunteers')).setColumnToValue(0, '12');
    await element(by.id('continue-to-select-service-users')).tap();

    // await expect(element(by.id('currently-added-service-users'))).toExist();

    // Select a user
    // Create the session
    // Check it redirects
  });
});
