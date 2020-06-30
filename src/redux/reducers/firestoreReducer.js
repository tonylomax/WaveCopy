export const initialState = {
  sessionData: {},
  userData: {},
};
import {ACTIONS} from '../../constants/actions';

export default (state = initialState, action) => {
  console.log('[REDUCER], firestorereducer');
  switch (action.type) {
    case ACTIONS.SUBSCRIBE_TO_SESSIONS:
      console.log(
        '[Reducer - fireStoreReducer] SUBSCRIBE TO SESSIONS',
        action.data,
      );
      const sessionData = action.data;

      return {...state, sessionData};

    case ACTIONS.SET_CURRENT_FIRESTORE_USER_DATA:
      console.log(
        '[Reducer - fireStoreReducer]SET_CURRENT_FIRESTORE_USER_DATA',
        action,
      );
      const userData = action.data;
      return {...state, userData};
    case ACTIONS.GET_ALL_BEACHES:
      console.log('[Reducer - fireStoreReducer] GET_ALL_BEACHES', action);
      const beaches = action.data;
      return {...state, beaches};
    default:
      return state;
  }
};
