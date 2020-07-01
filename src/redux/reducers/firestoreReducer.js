export const initialState = {
  sessionData: {},
  userData: {},
  selectedSessionAttendees: {},
  singleSession: {},
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

    case ACTIONS.SUBSCRIBE_TO_SINGLE_SESSION:
      console.log(
        '[Reducer - fireStoreReducer] SUBSCRIBE_TO_SINGLE_SESSION',
        action.data._data,
      );
      const singleSession = action.data._data;

      return {...state, singleSession};

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

    case ACTIONS.GET_SESSION_ATTENDEES:
      console.log(
        '[Reducer - fireStoreReducer] GET_SESSIONS_ATTENDEES',
        action.data,
      );
      const selectedSessionAttendees = action.data;
      return {...state, selectedSessionAttendees};

    default:
      return state;
  }
};
