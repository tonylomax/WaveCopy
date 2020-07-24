import storage from '@react-native-firebase/storage';

export default uploadFile = (localFilePath, uid) => {
  return storage().ref(`/ProfilePics/${uid}.JPG`).putFile(localFilePath);
};
