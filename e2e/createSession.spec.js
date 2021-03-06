describe('Create a surf session', () => {
  exampleEmail = 'j@j.com';
  examplePassword = 'asdasd';
  function timeout(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  it('It should be able to navigate to create session page, fill in the form, select attendees and create a session', async () => {
    if (device.getPlatform() === 'ios') {
      // =======================IOS============================
      await element(by.id('email')).typeText(exampleEmail);
      await element(by.id('password')).typeText(examplePassword);
      await element(by.id('submit-login-details')).tap();

      await timeout(5000);
      waitFor(element(by.id('navigate-to-create-session')))
        .toExist()
        .withTimeout(5000);

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
        'Fistral Beach',
      );
      // Only available on ios
      await element(by.id('number-of-volunteers')).setColumnToValue(0, '12');
      await element(by.id('number-of-repetitions')).setColumnToValue(0, '1');
      await element(by.id('continue-to-select-service-users')).tap();

      await expect(element(by.id('currently-added-service-users'))).toExist();

      // Select a user
      // await element(by.id('service-user-1')).tap();
      await element(by.id('continue-to-review-created-session-page')).tap();

      await expect(element(by.id('coordinator-name'))).toExist();

      await waitFor(element(by.id('mentors-accordian')))
        .toExist()
        .withTimeout(1000);
      await waitFor(element(by.id('attendees-accordian')))
        .toExist()
        .withTimeout(1000);
      await waitFor(element(by.id('location-accordian')))
        .toExist()
        .withTimeout(1000);

      await element(by.id('description-of-session')).typeText(
        'surfing at Fistral beach',
      );
      await element(by.id('confirm-session-details')).tap();
      await waitFor(element(by.id('yesButtonChoicePopup')))
        .toExist()
        .withTimeout(2000);
      await element(by.id('yesButtonChoicePopup')).tap();

      await element(by.id('navigate-to-profile-button')).tap();
      await waitFor(element(by.id('bio')))
        .toExist()
        .withTimeout(10000);

      await element(by.id('signOutButton')).tap();
      await expect(element(by.id('email'))).toExist();
    } else {
      // =======================ANDROID============================
      await element(by.id('email')).typeText(exampleEmail);
      await element(by.id('password')).typeText(examplePassword);
      await element(by.id('submit-login-details')).tap();
      await timeout(5000);
      waitFor(element(by.id('navigate-to-create-session')))
        .toExist()
        .withTimeout(5000);

      await element(by.id('navigate-to-create-session')).tap();

      await expect(element(by.id('create-session-title'))).toExist();
      await expect(element(by.id('type-of-session'))).toExist();

      await element(by.id('session-details-scroll-view')).scrollTo('bottom');

      await element(by.id('continue-to-select-service-users')).tap();

      await expect(element(by.id('currently-added-service-users'))).toExist();

      // Select a user - removed because search is coming in
      // await element(by.id('service-user-1')).tap();
      await element(by.id('continue-to-review-created-session-page')).tap();
      await expect(element(by.id('coordinator-name'))).toExist();

      await waitFor(element(by.id('mentors-accordian')))
        .toExist()
        .withTimeout(1000);
      await waitFor(element(by.id('attendees-accordian')))
        .toExist()
        .withTimeout(1000);
      await waitFor(element(by.id('location-accordian')))
        .toExist()
        .withTimeout(1000);

      await element(by.id('description-of-session')).typeText(
        'surfing at Fistral beach',
      );
      await element(by.id('confirm-session-details')).tap();
      await element(by.id('yesButtonChoicePopup')).tap();
      await element(by.id('navigate-to-profile-button')).tap();
      await waitFor(element(by.id('bio')))
        .toExist()
        .withTimeout(10000);

      await element(by.id('signOutButton')).tap();
      await expect(element(by.id('email'))).toExist();
    }
  });
});
