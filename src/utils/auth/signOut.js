import auth from '@react-native-firebase/auth';
import {
  updateRoleSpecificSessions,
  updateSessions,
  updateFirestoreUserData,
} from './../../redux/';
import store from './../../redux/store';

export default async function signOut() {
  return new Promise(async (resolve, reject) => {
    store.dispatch(updateRoleSpecificSessions([]));
    store.dispatch(updateSessions([]));
    store.dispatch(updateFirestoreUserData({}));
    auth()
      .signOut()
      .then(() => {
        console.log('User signed out!');
        resolve('User signed out');
      })
      .catch((err) => {
        console.log('Signout Err', err);
        reject(err);
      });
  });
}
