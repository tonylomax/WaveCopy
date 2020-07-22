import firestore from '@react-native-firebase/firestore';
import {COLLECTIONS} from 'constants';
import store from '../../redux/store';
import {
  subscribeToSessionMentors,
  subscribeToSessionAttendees,
} from '../../redux/index';

export default updateCurrentSessionAttendees = (attendeesArray, collection) => {
  return attendeesArray?.map((user) => {
    return firestore()
      .collection(collection)
      .doc(user.id)
      .onSnapshot(
        (subscribedUser) => {
          console.log(
            `inside on updateCurrentSessionAttendees snapshot, received some data `,
          );
          let subscribedUserData = {
            ...subscribedUser._data,
            id: subscribedUser._ref._documentPath?._parts[1],
          };
          if (collection === 'Users') {
            store.dispatch(subscribeToSessionMentors(subscribedUserData));
          } else {
            store.dispatch(subscribeToSessionAttendees(subscribedUserData));
          }

          console.log('subscribedUserData', subscribedUserData);
        },
        (err) => {
          console.log(err);
        },
      );
  });
};
