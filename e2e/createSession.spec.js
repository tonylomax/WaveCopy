describe('Create a surf session', () => {
  exampleEmail = 't@t.com';
  examplePassword = 'asfsaf221@212sf';
  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('It should be able to navigate to create session page, fill in the form, select attendees and create a session', async () => {
    if (device.getPlatform() === 'ios') {
      // =======================IOS============================
      await element(by.id('email')).typeText(exampleEmail);
      await element(by.id('password')).typeText(examplePassword);
      await element(by.id('submit-login-details')).tap();
      await element(by.id('navigate-to-create-session')).tap();
      await expect(element(by.id('create-session-title'))).toExist();
      await expect(element(by.id('type-of-session'))).toExist();

      // Only available on ios
      await element(by.id('type-of-session')).setColumnToValue(
        0,
        'Surf therapy',
      );

      // Only available on ios
      await element(by.id('date-of-session')).setDatePickerDate(
        '2023-02-06',
        'yyyy-MM-dd',
      );
      // Set time
      await element(by.id('time-of-session')).setDatePickerDate(
        '2033-02-06T00:08:00-08:00',
        "yyyy-MM-dd'T'HH:mm:ssZZZZZ",
      );
      await element(by.id('session-details-scroll-view')).scrollTo('bottom');
      // Only available on ios
      await element(by.id('location-of-session')).setColumnToValue(
        0,
        'Cornwall - Fistral',
      );
      // Only available on ios
      await element(by.id('number-of-volunteers')).setColumnToValue(0, '12');
      await element(by.id('continue-to-select-service-users')).tap();

      await expect(element(by.id('currently-added-service-users'))).toExist();

      // Select a user
      await element(by.id('joe-bloggs')).tap();
      await element(by.id('continue-to-review-created-session-page')).tap();

      await expect(element(by.id('coordinator-name'))).toExist();
    } else {
      // =======================ANDROID============================
      await element(by.id('email')).typeText(exampleEmail);
      await element(by.id('password')).typeText(examplePassword);
      await element(by.id('submit-login-details')).tap();
      await element(by.id('navigate-to-create-session')).tap();
      await expect(element(by.id('create-session-title'))).toExist();
      await expect(element(by.id('type-of-session'))).toExist();

      await element(by.id('session-details-scroll-view')).scrollTo('bottom');

      await element(by.id('continue-to-select-service-users')).tap();

      await expect(element(by.id('currently-added-service-users'))).toExist();

      // Select a user
      await element(by.id('joe-bloggs')).tap();
      await element(by.id('continue-to-review-created-session-page')).tap();
    }

    // Go to review session page
    // Check that there is a coordinator
    // click on the edit description and write something.
    // Confirm the session
    // select the 'yes' to create the session
    // Ensure you're redirected to the session page
  });
});
