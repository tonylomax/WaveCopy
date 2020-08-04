import storage from '@react-native-firebase/storage';

export default simplyGetImageDownloadURI = (uid) => {
  return new Promise(async (resolve, reject) => {
    console.log('getImageDownloadURI', uid);
    // return new Promise(async (resolve, reject) => {
    try {
      const ref = storage().ref(`/ProfilePics/${uid}.JPG`);
      console.log('ref', ref);
      const downloadURL = await ref.getDownloadURL();
      resolve(downloadURL);
    } catch (err) {
      reject(err);
    }
  });
};
