import firestore from '@react-native-firebase/firestore';
import {COLLECTIONS} from 'constants';
import store from '../../redux/store';
import {updateSessionMentors, updateSessionAttendees} from '../../redux/index';

export default subscribeToCurrentSessionAttendees = (
  attendeesArray,
  collection,
) => {
  const subscribedUserArray = [];
  console.log({attendeesArray});
  const newAttendeesArray = attendeesArray === undefined ? [] : attendeesArray;
  // If the session has no mentors , clear it
  if (newAttendeesArray.length === 0) {
    store.dispatch(updateSessionMentors([]));
    return;
  }

  return newAttendeesArray?.map((user) => {
    return firestore()
      .collection(collection)
      .doc(user.id)
      .onSnapshot(
        (subscribedUser) => {
          console.log(
            `inside on subscribeToCurrentSessionAttendees snapshot, received some data `,
          );

          const subscribedUserData = {
            ...subscribedUser.data(),
            id: subscribedUser.id,
          };
          subscribedUserArray.push(subscribedUserData);

          if (subscribedUserArray.length === newAttendeesArray.length) {
            if (collection === 'Users') {
              store.dispatch(updateSessionMentors(subscribedUserArray));
            } else {
              store.dispatch(updateSessionAttendees(subscribedUserArray));
            }
          }
        },
        (err) => {
          console.log(err);
        },
      );
  });
};
