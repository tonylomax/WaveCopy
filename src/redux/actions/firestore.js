import firestore from '@react-native-firebase/firestore';
import {ACTIONS, COLLECTIONS} from 'constants';
import {updateCurrentSessionAttendees} from 'utils';

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

export function subscribeToFirestoreUserData(currentUserUID) {
  console.log('INSIDE subscribeToFirestoreUserData ACTION ', currentUserUID);
  return async (dispatch) => {
    const userDataSubscription = firestore()
      .collection(COLLECTIONS.USERS)
      .doc(currentUserUID)
      .onSnapshot(
        (userData) => {
          const updatedUserData = userData?.data();
          // console.log('updatedUserData', updatedUserData);
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
    console.log('beaches retrieved, ', beaches);
    dispatch({
      type: ACTIONS.GET_ALL_BEACHES,
      data: beaches,
    });
  };
}

export function subscribeToSessionMentors(subscribedUserData) {
  console.log('Inside subscribeToSessionMentors action');
  return async (dispatch) => {
    dispatch({
      type: ACTIONS.SUBSCRIBE_TO_SESSION_MENTORS,
      data: subscribedUserData,
    });
  };
}

export function subscribeToSessionAttendees(subscribedUserData) {
  console.log('Inside subscribeToSessionAttendees action');
  return async (dispatch) => {
    dispatch({
      type: ACTIONS.SUBSCRIBE_TO_SESSION_ATTENDEES,
      data: subscribedUserData,
    });
  };
}

export function clearSelectedSessionMentors() {
  return async (dispatch) => {
    dispatch({
      type: ACTIONS.CLEAR_SUBSCRIBE_TO_SESSION_MENTORS,
      data: [],
    });
  };
}

export function clearSelectedSessionAttendees() {
  return async (dispatch) => {
    dispatch({
      type: ACTIONS.CLEAR_SUBSCRIBE_TO_SESSION_ATTENDEES,
      data: [],
    });
  };
}
