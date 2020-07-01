import firestore from '@react-native-firebase/firestore';
import {ACTIONS} from '../../constants/actions';
import {returnSessionAttendees} from 'utils';

export function subscribeToAllSessions() {
  console.log('Inside session data action');
  return async (dispatch) => {
    const sessions = firestore()
      .collection('Sessions')
      .onSnapshot(
        (sessionData) => {
          console.log('sessionData', sessionData);
          const sessionsData = sessionData.docs.map((session) => {
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

export function subscribeToFirestoreUserData(currentUserUID) {
  console.log('INSIDE subscribeToFirestoreUserData ACTION ');
  return async (dispatch) => {
    const userDataSubscription = firestore()
      .collection('Users')
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

export function getAllBeaches() {
  console.log('INSIDE getAllBeaches ACTION ');
  return async (dispatch) => {
    const beaches = [];
    const snapshot = await firestore().collection('Beaches').get();
    snapshot.docs.map((doc) => beaches.push(doc.data()));
    dispatch({
      type: ACTIONS.GET_ALL_BEACHES,
      data: beaches,
    });
  };
}

export function getAllSessionAttendees(attendeesArray) {
  console.log('INSIDE getAllSessionAttendees ACTION ');
  return async (dispatch) => {
    const SESSION_USERS = await returnSessionAttendees(attendeesArray);
    console.log('SESSION_USERS', SESSION_USERS);

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
