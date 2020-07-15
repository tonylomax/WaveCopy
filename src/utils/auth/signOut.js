import auth from '@react-native-firebase/auth';
import {
  updateRoleSpecificSessions,
  updateSessions,
  updateFirestoreUserData,
} from './../../redux/';
import store from './../../redux/store';

export default async function signOut() {
  return await auth()
    .signOut()
    .then(() => {
      store.dispatch(updateRoleSpecificSessions([]));
      store.dispatch(updateSessions([]));
      store.dispatch(updateFirestoreUserData({}));
      console.log('User signed out!');
    });
}
