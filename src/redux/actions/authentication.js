import auth from '@react-native-firebase/auth';

import {ACTIONS} from '../../constants/actions';

export function createFirebaseAuthSubscription() {
  console.log('[Action] createFirebaseAuthSubscription');
  return (dispatch) => {
    return auth().onAuthStateChanged((user) => {
      console.log('AUTH STATE CHANGED', user);
      if (user) {
        // Login
        dispatch({type: ACTIONS.SET_CURRENT_AUTHENTICATED_USER, data: user});
      } else {
        // Signout
        dispatch({type: ACTIONS.SET_CURRENT_AUTHENTICATED_USER, data: {}});
      }
    });
  };
}
