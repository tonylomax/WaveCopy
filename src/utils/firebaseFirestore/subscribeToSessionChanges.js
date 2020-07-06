import firestore from '@react-native-firebase/firestore';
import {COLLECTIONS} from '../../constants/collections';
import store from '../../redux/store';
import {updateCurrentSession} from '../../redux/';

export default (sessionID) => {
  console.log('creating a subscription');
  const subscription = firestore()
    .collection(COLLECTIONS.SESSIONS)
    .doc(sessionID)
    .onSnapshot(
      (singleSessionData) => {
        console.log(
          'inside on snapshot, received some data',
          singleSessionData,
        );
        store.dispatch(updateCurrentSession(singleSessionData));
      },
      (error) => {
        console.error(error);
      },
    );
  console.log('subscription created', subscription);
  return subscription;
};
