describe('Check that Redux can subscribe to changing data in Firestore', () => {
  beforeEach(async () => {
    await device.reloadReactNative();
  });
  it('Should update the app screen with live session data from Firestore', async () => {
    //do test stuff here
    await expect(element(by.id('SessionsList'))).toExist();
    await expect(element(by.id('SessionsListItem'))).toExist();
  });
});
