import firestore from '@react-native-firebase/firestore';
import {COLLECTIONS} from 'constants';
import store from '../../redux/store';
import {
  subscribeToSessionMentors,
  subscribeToSessionAttendees,
} from '../../redux/index';

// export default returnSessionAttendees = async (attendeesArray, collection) => {
//   console.log('returnSessionAttendees', attendeesArray, collection);

//   return new Promise(async (resolve, reject) => {
//     console.log({attendeesArray});
//     if (attendeesArray === undefined) {
//       reject('attendeesArray is undefined');
//     }
//     try {
//       const resolvedUsers = await Promise.all(
//         attendeesArray.map(async (user) => {
//           console.log('user', user.id);
//           const userPromise = await firestore()
//             .collection(collection)
//             .doc(user.id)
//             .get();

//           return userPromise;
//         }),
//       );
//       resolve(resolvedUsers);
//     } catch (err) {
//       reject(err);
//     }
//   });
// };

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
