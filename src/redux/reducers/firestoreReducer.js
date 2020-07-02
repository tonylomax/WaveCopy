export const initialState = {
  sessionData: {},
  userData: {},
  selectedSessionAttendees: {},
  singleSession: {},
  selectedSessionMentors: {},
  singleBeach: {},
};
import {ACTIONS} from '../../constants/actions';

export default (state = initialState, action) => {
  console.log('[REDUCER], firestorereducer');
  switch (action.type) {
    case ACTIONS.SUBSCRIBE_TO_SESSIONS:
      console.log('[Reducer - fireStoreReducer] SUBSCRIBE TO SESSIONS');
      const sessionData = action.data;

      return {...state, sessionData};

    case ACTIONS.SUBSCRIBE_TO_SINGLE_SESSION:
      console.log('[Reducer - fireStoreReducer] SUBSCRIBE_TO_SINGLE_SESSION');
      const singleSession = action.data._data;

      return {...state, singleSession};

    case ACTIONS.SET_CURRENT_FIRESTORE_USER_DATA:
      console.log(
        '[Reducer - fireStoreReducer]SET_CURRENT_FIRESTORE_USER_DATA',
      );
      const userData = action.data;
      return {...state, userData};

    case ACTIONS.GET_SINGLE_BEACH:
      console.log('[Reducer - fireStoreReducer] GET_SINGLE_BEACH', action);
      const singleBeach = action.data;
      return {...state, singleBeach};

    case ACTIONS.GET_SESSION_ATTENDEES:
      console.log('[Reducer - fireStoreReducer] GET_SESSIONS_ATTENDEES');
      const selectedSessionAttendees = action.data;
      return {...state, selectedSessionAttendees};

    case ACTIONS.GET_SESSION_MENTORS:
      console.log('[Reducer - fireStoreReducer] GET_SESSION_MENTORS');
      const selectedSessionMentors = action.data;
      return {...state, selectedSessionMentors};

    default:
      return state;
  }
};
