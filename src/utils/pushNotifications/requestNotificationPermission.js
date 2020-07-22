import messaging from '@react-native-firebase/messaging';

export default requestUserPermission = () => {
  return new Promise(async (resolve, reject) => {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Authorization status:', authStatus);
      resolve(authStatus);
    } else reject(authStatus);
  });
};
