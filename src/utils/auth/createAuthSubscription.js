import auth from '@react-native-firebase/auth';
import store from '../../redux/store';
import {createFirebaseAuthSubscription} from '../../redux/';

export default () => {
  return auth().onAuthStateChanged((user) => {
    console.log('AUTH STATE CHANGED', user?.email);
    store.dispatch(createFirebaseAuthSubscription(user));
  });
};
