import storage from '@react-native-firebase/storage';

export default uploadFile = (localFilePath, UID) => {
  return storage().ref(`/ProfilePics/${UID}.JPG`).putFile(localFilePath);
};
