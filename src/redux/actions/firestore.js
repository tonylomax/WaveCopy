import firestore from '@react-native-firebase/firestore';
import {ACTIONS} from '../../constants/actions';

export function subscribeToAllSessions() {
  console.log('Inside session data action');
  return async (dispatch) => {
    const sessions = firestore()
      .collection('Sessions')
      .onSnapshot(
        (sessionData) => {
          console.log('sessionData ', sessionData.docs);
          const sessionsData = sessionData.docs.map((session) => {
            return {
              ID: session?._ref?._documentPath?._parts[1],
              Beach: session?._data?.Beach,
              Date: session?._data?.Date,
              Time: session?._data?.Time,
              Description: session?._data?.Description,
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
        console.log('updatedUserData ', updatedUserData);
        dispatch({
          type: ACTIONS.SET_CURRENT_FIRESTORE_USER_DATA,
          data: updatedUserData,
        });
      });
    return userDataSubscription;
  };
}
