import storage from '@react-native-firebase/storage';

export default getDownloadURI = async (UID) => {
  return new Promise((resolve, reject) => {
    const ref = storage().ref(`/ProfilePics/${UID}.JPG`);
    const downloadURL = ref.getDownloadURL();
    return downloadURL
      .then((downloadURL) => {
        resolve(downloadURL);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
