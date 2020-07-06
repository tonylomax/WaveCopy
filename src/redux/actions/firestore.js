import firestore from '@react-native-firebase/firestore';
import {ACTIONS} from '../../constants/actions';
import {COLLECTIONS} from '../../constants/collections';
import {returnSessionAttendees} from 'utils';

export function updateSessions(sessionsData) {
  console.log('Inside updateSessions data action');
  return async (dispatch) => {
    dispatch({
      type: ACTIONS.UPDATE_SESSIONS,
      data: sessionsData,
    });
  };
}

export function updateCurrentSession(singleSessionData) {
  console.log('subscription came in subscribeToSession action ');
  console.log({singleSessionData});
  return (dispatch) =>
    dispatch({
      type: ACTIONS.UPDATE_CURRENT_SESSION,
      data: singleSessionData,
    });
}

export function updateFirestoreUserData(updatedUserData) {
  console.log('INSIDE subscribeToFirestoreUserData ACTION ');
  return async (dispatch) => {
    dispatch({
      type: ACTIONS.SET_CURRENT_FIRESTORE_USER_DATA,
      data: updatedUserData,
    });
  };
}

export function updateBeach(singleBeach) {
  return async (dispatch) => {
    dispatch({
      type: ACTIONS.GET_SINGLE_BEACH,
      data: singleBeach,
    });
  };
}

export function getAllBeaches() {
  console.log('INSIDE getAllBeaches ACTION ');
  return async (dispatch) => {
    // const beaches = [];
    const snapshot = await firestore().collection(COLLECTIONS.BEACHES).get();
    const beaches = snapshot.docs.map((doc) => {
      return {
        data: doc.data(),
        id: doc._ref?._documentPath?._parts[1],
      };
    });
    console.log('beaches retrieved, ', beaches);
    dispatch({
      type: ACTIONS.GET_ALL_BEACHES,
      data: beaches,
    });
  };
}

export function getAllSessionAttendees(attendeesArray) {
  console.log('INSIDE getAllSessionAttendees ACTION ');
  return async (dispatch) => {
    const SESSION_USERS = await returnSessionAttendees(
      attendeesArray,
      COLLECTIONS.SERVICE_USERS,
    );
    // console.log('SESSION_USERS', SESSION_USERS);

    const SESSION_USERS_FILTERED = SESSION_USERS.map((user) => {
      const data = user?._data;
      const id = user?._ref?._documentPath?._parts[1];
      return {id, data};
    });

    dispatch({
      type: ACTIONS.GET_SESSION_ATTENDEES,
      data: SESSION_USERS_FILTERED,
    });
  };
}

export function getAllSessionMentors(mentorsArray) {
  console.log('INSIDE getAllSessionMentors ACTION ');
  console.log({mentorsArray});
  return async (dispatch) => {
    const SESSION_MENTORS = await returnSessionAttendees(
      mentorsArray,
      COLLECTIONS.USERS,
    );
    // console.log('SESSION_MENTORS', SESSION_MENTORS);

    const SESSION_MENTORS_FILTERED = SESSION_MENTORS.map((mentor) => {
      const data = mentor?._data;
      const id = mentor?._ref?._documentPath?._parts[1];
      return {id, data};
    });

    dispatch({
      type: ACTIONS.GET_SESSION_MENTORS,
      data: SESSION_MENTORS_FILTERED,
    });
  };
}
