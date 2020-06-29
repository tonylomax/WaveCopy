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
    dateTimeArray.map((sessionDate) => {
      firestore()
        .collection('Sessions')
        .add({
          Attendees: selectedUsers,
          MaxMentors: numberOfVolunteers,
          Beach: location.name,
          Type: sessionType,
          Description: descriptionOfSession,
          DateTime: sessionDate.format(),
          CoordinatorID: coordinator, // TODO - update with user Id from redux in ConfirmSession.js
          Region: location.region,
          // Surf lead ID
        })
        .then((session) => {
          console.log('Session added!', session);
        })
        .catch((err) => {
          console.log(err);
          reject(err);
        });
      resolve('All sessions created');
    });
  });
};
export default createSessionInFirestore;
