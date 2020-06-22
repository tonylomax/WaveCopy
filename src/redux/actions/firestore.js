import firestore from '@react-native-firebase/firestore';

export function subscribeToAllSessions() {
  console.log('Inside session data action');

  return async (dispatch) => {
    const sessions = firestore()
      .collection('Sessions')
      .onSnapshot(
        (sessionData) => {
          //   const sessionsData = userData?.data();
          console.log('sessionData ', sessionData);
          //   dispatch({
          //     type: ACTIONS.SET_CURRENT_FIRESTORE_USER_DATA,
          //     data: updatedUserData,
          //   });
        },
        (error) => {
          console.error(error);
        },
      );
    return sessions;
  };
}
