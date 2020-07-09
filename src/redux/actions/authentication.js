import {ACTIONS} from 'constants';

export function setCurrentAuthenticatedUser(user) {
  console.log('[Action] setCurrentAuthenticatedUser');
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
