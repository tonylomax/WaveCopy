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

  if (newAttendeesArray.length === 0 && collection === 'Users') {
    store.dispatch(updateSessionMentors([]));
    return;
  } else if (newAttendeesArray.length === 0 && collection !== 'Users') {
    store.dispatch(updateSessionAttendees([]));
    return;
  }

  console.log({subscribedUserArray});
  subscribedUserArray.length = 0;
  console.log({subscribedUserArray});
  return newAttendeesArray?.map((user) => {
    return firestore()
      .collection(collection)
      .doc(user.id)
      .onSnapshot(
        (subscribedUser) => {
          console.log(
            `inside on subscribeToCurrentSessionAttendees snapshot, received some data `,
          );

          // console.log('newAttendeesArray', newAttendeesArray);
          // console.log(
          //   'subscribedUserArray before changes',
          //   subscribedUserArray,
          // );

          const subscribedUserData = {
            ...subscribedUser.data(),
            id: subscribedUser.id,
          };

          const existingUser = subscribedUserArray.find((user) => {
            return user.id === subscribedUserData.id;
          });

          console.log('existingUser', existingUser);
          console.log('subscribedUserData', subscribedUserData);

          if (existingUser !== undefined) {
            const foundIndex = subscribedUserArray.findIndex(
              (currentUser) => currentUser.id == subscribedUserData.id,
            );
            subscribedUserArray[foundIndex] = subscribedUserData;
          } else {
            subscribedUserArray.push(subscribedUserData);
          }

          console.log(
            'subscribedUserArray before dispatch',
            subscribedUserArray,
          );
          // if (subscribedUserArray.length === newAttendeesArray.length) {
          if (collection === 'Users') {
            store.dispatch(updateSessionMentors(subscribedUserArray));
          } else {
            store.dispatch(updateSessionAttendees(subscribedUserArray));
          }
          // }
        },
        (err) => {
          console.log(err);
        },
      );
  });
};
