export const initialState = {
  sessionData: [],
  roleSpecificSessionData: [],
  userData: {},
  singleSession: {},
  selectedSessionMentors: [],
  singleBeach: {},
  beaches: [],
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

    case ACTIONS.SUBSCRIBE_TO_SINGLE_SESSION:
      console.log('[Reducer - fireStoreReducer] SUBSCRIBE_TO_SINGLE_SESSION');

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

    case ACTIONS.GET_SESSION_ATTENDEES:
      console.log('[Reducer - fireStoreReducer] GET_SESSIONS_ATTENDEES');
      const selectedSessionAttendees = action.data;
      return {...state, selectedSessionAttendees};

    case ACTIONS.GET_SESSION_MENTORS:
      console.log('[Reducer - fireStoreReducer] GET_SESSION_MENTORS');
      const selectedSessionMentors = action.data;
      return {...state, selectedSessionMentors};

    case ACTIONS.SUBSCRIBE_TO_SESSION_MENTORS:
      console.log(
        '[Reducer - fireStoreReducer] SUBSCRIBE_TO_SESSION_MENTORS',
        action.data,
      );

      let mentorInStore = state.selectedSessionSubscribedMentors.filter(
        (mentor) => {
          return mentor.id === action.data.id;
        },
      );

      if (mentorInStore.length > 0) {
        return {
          ...state,
          selectedSessionSubscribedMentors: state.selectedSessionSubscribedMentors.map(
            (mentor) => {
              if (mentor.id === action.data.id) {
                return action.data;
              } else return mentor;
            },
          ),
        };
      } else {
        return {
          ...state,
          selectedSessionSubscribedMentors: [
            ...state.selectedSessionSubscribedMentors,
            action.data,
          ],
        };
      }

    case ACTIONS.CLEAR_SUBSCRIBE_TO_SESSION_MENTORS:
      console.log(
        '[Reducer - fireStoreReducer] CLEAR_SUBSCRIBE_TO_SESSION_MENTORS',
        action.data,
      );

      return {
        ...state,
        selectedSessionSubscribedMentors: [],
      };

    case ACTIONS.SUBSCRIBE_TO_SESSION_ATTENDEES:
      console.log(
        '[Reducer - fireStoreReducer] SUBSCRIBE_TO_SESSION_ATTENDEES',
        action.data,
      );

      let attendeeInStore = state.selectedSessionSubscribedAttendees.filter(
        (attendee) => {
          return attendee.id === action.data.id;
        },
      );

      if (attendeeInStore.length > 0) {
        return {
          ...state,
          selectedSessionSubscribedAttendees: state.selectedSessionSubscribedAttendees.map(
            (attendee) => {
              if (attendee.id === action.data.id) {
                return action.data;
              } else return attendee;
            },
          ),
        };
      } else {
        return {
          ...state,
          selectedSessionSubscribedAttendees: [
            ...state.selectedSessionSubscribedAttendees,
            action.data,
          ],
        };
      }

    case ACTIONS.CLEAR_SUBSCRIBE_TO_SESSION_ATTENDEES:
      console.log(
        '[Reducer - fireStoreReducer] CLEAR_SUBSCRIBE_TO_SESSION_ATTENDEES',
        action.data,
      );

      return {
        ...state,
        selectedSessionSubscribedMentors: [],
      };

    default:
      return state;
  }
};
