import firestore from '@react-native-firebase/firestore';
import {COLLECTIONS} from '../../constants/collections';
import store from '../../redux/store';
import {updateFirestoreUserData} from '../../redux/';

export default (currentUserUID) => {
  return firestore()
    .collection(COLLECTIONS.USERS)
    .doc(currentUserUID)
    .onSnapshot((userData) => {
      const updatedUserData = userData?.data();
      store.dispatch(updateFirestoreUserData(updatedUserData));
    });
};
