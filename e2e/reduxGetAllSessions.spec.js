describe('Check that Redux can subscribe to changing data in Firestore', () => {
  beforeEach(async () => {
    await device.reloadReactNative();
  });
  it('Should update the app screen with live session data from Firestore', async () => {
    //do test stuff here
    await expect(element(by.id('SessionsList'))).toExist();
    await expect(element(by.id));
    // get id of flatList, check to see if there is either a Text tag that says no
    // sessions or at least one session with a list of attenddes, a location, a formateed date tiem
    // and a description
  });
});
