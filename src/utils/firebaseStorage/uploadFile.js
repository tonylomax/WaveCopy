import storage from '@react-native-firebase/storage';

export default uploadFile = async (localFilePath, UID) => {
  return new Promise((resolve, reject) => {
    storage()
      .ref(`/ProfilePics/${UID}.JPG`)
      .putFile(localFilePath)
      .then((result) => {
        resolve(result);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
