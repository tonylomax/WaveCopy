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
        attended: false,
      });
    });
    console.log('location', location.id);
    let groupID = '';
    if (dateTimeArray.length > 1) {
      console.log('about to generate multi sessions');
      groupID = uuidv1();
      console.log(groupID);
    }
    dateTimeArray.map((sessionDate, i) => {
      firestore()
        .collection('Sessions')
        .add({
          attendees: updatedAttendees,
          maxMentors: numberOfVolunteers,
          mentors: [],
          beach: location.name,
          beachID: location.id,
          type: sessionType,
          description: descriptionOfSession,
          dateTime: sessionDate.format(),
          coordinatorID: uid,
          coordinatorName: coordinator,
          regionID: location.region,
          groupID,
          groupSessionOrder: i + 1,
          createdAt: firestore.FieldValue.serverTimestamp(),
          updatedAt: firestore.FieldValue.serverTimestamp(),
          sessionLead: {
            id: '',
            createdAt: firestore.FieldValue.serverTimestamp(),
          },
          // Surf lead id
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
