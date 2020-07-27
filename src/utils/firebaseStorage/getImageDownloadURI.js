import storage from '@react-native-firebase/storage';

export default getImageDownloadURI = async (uid) => {
  return new Promise(async (resolve, reject) => {
    const ref = storage().ref(`/ProfilePics/${uid}.JPG`);
    try {
      const downloadURL = await ref.getDownloadURL();
      resolve(downloadURL);
    } catch (err) {
      reject(err);
    }
  });
};
