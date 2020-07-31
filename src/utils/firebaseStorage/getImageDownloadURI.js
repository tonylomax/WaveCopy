import storage from '@react-native-firebase/storage';
import store from '../../redux/store';
import {getProfilePicture} from '../../redux/index';

export default getImageDownloadURI = async (uid) => {
  console.log('getImageDownloadURI', uid);
  // return new Promise(async (resolve, reject) => {
  const ref = storage().ref(`/ProfilePics/${uid}.JPG`);
  console.log('ref', ref);
  // try {
  const downloadURL = await ref.getDownloadURL();
  store.dispatch(getProfilePicture(downloadURL));
  // } catch (err) {
  // reject(err);
  // }
  // });
};
