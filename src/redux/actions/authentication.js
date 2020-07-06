import auth from '@react-native-firebase/auth';

import {ACTIONS} from '../../constants/actions';

export function createFirebaseAuthSubscription(user) {
  console.log('[Action] createFirebaseAuthSubscription');
  return (dispatch) => {
    if (user) {
      // Login
      dispatch({type: ACTIONS.SET_CURRENT_AUTHENTICATED_USER, data: user});
    } else {
      // Signout
      dispatch({type: ACTIONS.SET_CURRENT_AUTHENTICATED_USER, data: {}});
    }
  };
}
