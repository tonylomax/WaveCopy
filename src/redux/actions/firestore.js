import firestore from '@react-native-firebase/firestore';
import {ACTIONS} from '../../constants/actions';
import {COLLECTIONS} from '../../constants/collections';
import {returnSessionAttendees} from 'utils';

export function subscribeToAllSessions() {
  console.log('Inside session data action');
  return async (dispatch) => {
    return firestore()
      .collection(COLLECTIONS.SESSIONS)
      .onSnapshot(
        (sessionData) => {
          const sessionsData = sessionData.docs.map((session) => {
            // console.log('session?._data?.Mentors ', session?._data?.Mentors);

            return {
              ID: session?._ref?._documentPath?._parts[1],
              Beach: session?._data?.Beach,
              DateTime: session?._data?.DateTime,
              Time: session?._data?.Time,
              Description: session?._data?.Description,
              AttendeesIDandAttendance: session?._data?.Attendees,
              CoordinatorID: session?._data?.CoordinatorID,
              MaxMentors: session?._data?.MaxMentors,
              Type: session?._data?.Type,
              Mentors: session?._data?.Mentors,
            };
          });
          dispatch({
            type: ACTIONS.SUBSCRIBE_TO_SESSIONS,
            data: sessionsData,
          });
        },
        (error) => {
          console.error(error);
        },
      );
    return sessions;
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
  console.log('INSIDE subscribeToFirestoreUserData ACTION ');
  return async (dispatch) => {
    const userDataSubscription = firestore()
      .collection(COLLECTIONS.USERS)
      .doc(currentUserUID)
      .onSnapshot((userData) => {
        const updatedUserData = userData?.data();
        dispatch({
          type: ACTIONS.SET_CURRENT_FIRESTORE_USER_DATA,
          data: updatedUserData,
        });
      });
    return userDataSubscription;
  };
}

export function subscribeToBeach(beachID) {
  console.log('INSIDE getAllBeaches ACTION ');
  return async (dispatch) => {
    const beachSubscription = firestore()
      .collection(COLLECTIONS.BEACHES)
      .doc(beachID)
      .onSnapshot((beach) => {
        const singleBeach = beach?.data();
        // console.log('singleBeach', singleBeach);
        dispatch({
          type: ACTIONS.GET_SINGLE_BEACH,
          data: singleBeach,
        });
      });
    return beachSubscription;
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
