import firestore from '@react-native-firebase/firestore';
import {COLLECTIONS} from 'constants';
import store from '../../redux/store';
import {updateCurrentSession} from '../../redux/';

export default (sessionID) => {
  console.log('coming into subscribe to session changes');
  console.log('subscribe to sessions running');
  console.log('creating a subscription');
  const subscription = firestore()
    .collection(COLLECTIONS.SESSIONS)
    .doc(sessionID)
    .onSnapshot(
      (singleSessionData) => {
        console.log('signle session data ', singleSessionData);
        console.log('inside on snapshot, received some data');
        store.dispatch(updateCurrentSession(singleSessionData));
      },
      (error) => {
        console.error(error);
      },
    );
  console.log('subscription created', subscription);
  return subscription;
};
