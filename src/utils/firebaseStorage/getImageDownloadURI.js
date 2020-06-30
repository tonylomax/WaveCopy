import storage from '@react-native-firebase/storage';

export default getImageDownloadURI = async (UID) => {
  return new Promise(async (resolve, reject) => {
    const ref = storage().ref(`/ProfilePics/${UID}.JPG`);
    try {
      const downloadURL = await ref.getDownloadURL();
      resolve(downloadURL);
    } catch (err) {
      reject(err);
    }
  });
};
