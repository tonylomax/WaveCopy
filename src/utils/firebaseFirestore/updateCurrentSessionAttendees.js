import firestore from '@react-native-firebase/firestore';
import {COLLECTIONS} from 'constants';
import store from '../../redux/store';
import {
  subscribeToSessionMentors,
  subscribeToSessionAttendees,
} from '../../redux/index';

export default updateCurrentSessionAttendees = (attendeesArray, collection) => {
  const subscribedUserArray = [];
  return attendeesArray?.map((user) => {
    return firestore()
      .collection(collection)
      .doc(user.id)
      .onSnapshot(
        (subscribedUser) => {
          console.log(
            `inside on updateCurrentSessionAttendees snapshot, received some data `,
          );
          const subscribedUserData = {
            ...subscribedUser.data(),
            id: subscribedUser.id,
          };
          subscribedUserArray.push(subscribedUserData);

          if (subscribedUserArray.length === attendeesArray.length) {
            if (collection === 'Users') {
              store.dispatch(subscribeToSessionMentors(subscribedUserArray));
            } else {
              store.dispatch(subscribeToSessionAttendees(subscribedUserArray));
            }
          }
        },
        (err) => {
          console.log(err);
        },
      );
  });
};
