import firestore from '@react-native-firebase/firestore';
import {ACTIONS, COLLECTIONS} from 'constants';
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

export function updateRoleSpecificSessions(roleSessions) {
  console.log('Inside updateRoleSpecificSessions action');
  return async (dispatch) => {
    dispatch({
      type: ACTIONS.UPDATE_ROLE_SESSIONS,
      data: roleSessions,
    });
  };
}

export function subscribeToSession(sessionID) {
  console.log('INSIDE subscribeToSession ACTION ');
  return async (dispatch) => {
    const sessionSubscription = firestore()
      .collection(COLLECTIONS.SESSIONS)
      .doc(sessionID)
      .onSnapshot(
        (singleSessionData) => {
          // console.log('singleSessionData', singleSessionData);
          dispatch({
            type: ACTIONS.SUBSCRIBE_TO_SINGLE_SESSION,
            data: singleSessionData,
          });
        },
        (error) => {
          console.error(error);
        },
      );
    return sessionSubscription;
  };
}

export function subscribeToFirestoreUserData(currentUserUID) {
  console.log('INSIDE subscribeToFirestoreUserData ACTION ', currentUserUID);
  return async (dispatch) => {
    const userDataSubscription = firestore()
      .collection(COLLECTIONS.USERS)
      .doc(currentUserUID)
      .onSnapshot(
        (userData) => {
          const updatedUserData = userData?.data();
          console.log('updatedUserData', updatedUserData);
          dispatch({
            type: ACTIONS.SET_CURRENT_FIRESTORE_USER_DATA,
            data: updatedUserData,
          });
        },
        (error) => {
          console.error(error);
        },
      );
    return userDataSubscription;
  };
}

export function updateCurrentSession(singleSessionData) {
  console.log('subscription came in subscribeToSession action ');
  // console.log({singleSessionData});
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
      const data = doc.data();
      const id = doc._ref?._documentPath?._parts[1];
      return {...data, id};
    });
    // console.log('beaches retrieved, ', beaches);
    dispatch({
      type: ACTIONS.GET_ALL_BEACHES,
      data: beaches,
    });
  };
}

export function getAllSessionAttendees(attendeesArray) {
  console.log('INSIDE getAllSessionAttendees ACTION ', attendeesArray);
  return async (dispatch) => {
    const SESSION_USERS = await returnSessionAttendees(
      attendeesArray,
      COLLECTIONS.TEST_SERVICE_USERS,
    ).catch((error) => {
      console.log(error);
    });
    // console.log('SESSION_USERS', SESSION_USERS);

    const SESSION_USERS_FILTERED = SESSION_USERS.map((user) => {
      const data = user?._data;
      const id = user?._ref?._documentPath?._parts[1];
      // console.log('SESSION ATTENDESS', {...data, id});
      return {...data, id};
    });

    dispatch({
      type: ACTIONS.GET_SESSION_ATTENDEES,
      data: SESSION_USERS_FILTERED,
    });
  };
}
export function clearSelectedSessionAttendees() {
  return async (dispatch) => {
    dispatch({
      type: ACTIONS.GET_SESSION_ATTENDEES,
      data: [],
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

    const SESSION_MENTORS_FILTERED = SESSION_MENTORS.map((mentor) => {
      const data = mentor?._data;
      const id = mentor?._ref?._documentPath?._parts[1];
      // console.log('SESSION MENTORS', {...data, id});
      return {...data, id};
    });

    dispatch({
      type: ACTIONS.GET_SESSION_MENTORS,
      data: SESSION_MENTORS_FILTERED,
    });
  };
}

export function clearSelectedSessionMentors() {
  return async (dispatch) => {
    dispatch({
      type: ACTIONS.GET_SESSION_MENTORS,
      data: [],
    });
  };
}
