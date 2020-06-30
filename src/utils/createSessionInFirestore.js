import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const createSessionInFirestore = ({
  sessionType,
  location,
  numberOfVolunteers,
  selectedUsers,
  dateTimeArray,
  descriptionOfSession,
  coordinator,
}) => {
  return new Promise((resolve, reject) => {
    const {uid} = auth().currentUser;
    dateTimeArray.map((sessionDate, i) => {
      firestore()
        .collection('Sessions')
        .add({
          Attendees: selectedUsers,
          MaxMentors: numberOfVolunteers,
          Beach: location.Name,
          Type: sessionType,
          Description: descriptionOfSession,
          DateTime: sessionDate.format(),
          CoordinatorID: uid, // TODO - update with user Id from redux in ConfirmSession.js
          CoordinatorName: coordinator,
          Region: location.region,
          // Surf lead ID
        })
        .then((session) => {
          console.log('Session added!', session);
        })
        .catch((err) => {
          if (i === 0) {
            reject('No sessions were created');
          } else {
            reject(
              'some sessions were created, some failed to create, please check sessions list. ',
              err,
            );
          }
        });
      resolve('All sessions created');
    });
  });
};
export default createSessionInFirestore;
