import firestore from '@react-native-firebase/firestore';
import 'react-native-get-random-values';
import {v1 as uuidv1} from 'uuid';

export default createSessionInFirestore = ({
  sessionType,
  location,
  numberOfVolunteers,
  selectedUsers,
  dateTimeArray,
  descriptionOfSession,
  coordinator,
  uid,
}) => {
  return new Promise((resolve, reject) => {
    const updatedAttendees = [];
    selectedUsers.map((user) => {
      updatedAttendees.push({
        id: user.objectID,
        Attended: false,
      });
    });
    console.log('location', location.id);
    let GroupID = '';
    if (dateTimeArray.length > 1) {
      GroupID = uuidv1();
    }
    dateTimeArray.map((sessionDate, i) => {
      firestore()
        .collection('Sessions')
        .add({
          Attendees: updatedAttendees,
          MaxMentors: numberOfVolunteers,
          Mentors: [],
          Beach: location.Name,
          BeachID: location.id,
          Type: sessionType,
          Description: descriptionOfSession,
          DateTime: sessionDate.format(),
          CoordinatorID: uid,
          CoordinatorName: coordinator,
          RegionID: location.Region,
          GroupID,
          CreatedAt: firestore.FieldValue.serverTimestamp(),
          UpdatedAt: firestore.FieldValue.serverTimestamp(),
          SessionLead: {
            id: '',
            CreatedAt: firestore.FieldValue.serverTimestamp(),
          },
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
