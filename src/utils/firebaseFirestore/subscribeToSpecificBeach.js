import firestore from '@react-native-firebase/firestore';
import {COLLECTIONS} from '../../constants/collections';
import store from '../../redux/store';
import {subscribeToBeach} from '../../redux/';

export default (beachID) => {
  console.log('INSIDE getAllBeaches ACTION ');
  return firestore()
    .collection(COLLECTIONS.BEACHES)
    .doc(beachID)
    .onSnapshot((beach) => {
      const singleBeach = beach?.data();
      store.dispatch(subscribeToBeach(beach));
    });
};
