export const initialState = {
  sessionData: [],
  roleSpecificSessionData: [],
  userData: {},
  singleSession: {},
  selectedSessionMentors: [],
  singleBeach: {},
  beaches: [],
  regions: [],
  selectedSessionSubscribedMentors: [],
  selectedSessionSubscribedAttendees: [],
};
import {ACTIONS} from 'constants';

export default (state = initialState, action) => {
  console.log('[REDUCER], firestorereducer');
  switch (action.type) {
    case ACTIONS.UPDATE_SESSIONS:
      console.log('[Reducer - fireStoreReducer] UPDATE_SESSIONS');
      const sessionData = action.data;

      return {...state, sessionData};

    case ACTIONS.CLEAR_CURRENT_SESSION:
      console.log('[Reducer - fireStoreReducer] CLEAR_CURRENT_SESSION');
      return {...state, singleSession: action.data};

    case ACTIONS.UPDATE_CURRENT_SESSION:
      console.log('[Reducer - fireStoreReducer] UPDATE_CURRENT_SESSION');
      const singleSession = action.data._data;

      return {...state, singleSession};

    case ACTIONS.UPDATE_ROLE_SESSIONS:
      console.log('[Reducer - fireStoreReducer] UPDATE_ROLE_SESSIONS');
      const roleSpecificSessionData = action.data;
      return {...state, roleSpecificSessionData};

    case ACTIONS.SET_CURRENT_FIRESTORE_USER_DATA:
      console.log(
        '[Reducer - fireStoreReducer]SET_CURRENT_FIRESTORE_USER_DATA',
      );
      const userData = action.data;
      return {...state, userData};

    case ACTIONS.GET_SINGLE_BEACH:
      console.log('[Reducer - fireStoreReducer] GET_SINGLE_BEACH');
      const singleBeach = action.data;
      return {...state, singleBeach};

    case ACTIONS.GET_ALL_BEACHES:
      console.log('[Reducer - fireStoreReducer] GET_ALL_BEACHES');
      const beaches = action.data;
      return {...state, beaches};

    case ACTIONS.GET_ALL_REGIONS:
      console.log('[Reducer - fireStoreReducer] GET_ALL_REGIONS', action);
      const regions = action.data;
      return {...state, regions};

    case ACTIONS.SUBSCRIBE_TO_SESSION_MENTORS:
      console.log(
        '[Reducer - fireStoreReducer] SUBSCRIBE_TO_SESSION_MENTORS',
        action.data,
      );

      return {...state, selectedSessionSubscribedMentors: action.data};

    case ACTIONS.CLEAR_SUBSCRIBE_TO_SESSION_MENTORS:
      console.log(
        '[Reducer - fireStoreReducer] CLEAR_SUBSCRIBE_TO_SESSION_MENTORS',
        action.data,
      );

      return {...state, selectedSessionSubscribedMentors: action.data};

    case ACTIONS.CLEAR_SUBSCRIBE_TO_SESSION_ATTENDEES:
      console.log(
        '[Reducer - fireStoreReducer] CLEAR_SUBSCRIBE_TO_SESSION_ATTENDEES',
        action.data,
      );

      return {
        ...state,
        selectedSessionSubscribedAttendees: [],
      };

    default:
      return state;
  }
};
