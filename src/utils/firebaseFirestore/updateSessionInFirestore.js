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
  sessionID,
}) => {
  return new Promise((resolve, reject) => {
    const updatedAttendees = [];
    selectedUsers.map((user) => {
      updatedAttendees.push({
        id: user.objectID || user.id,
        attended: false,
      });
    });
    console.log('location', location.id);
    firestore()
      .collection('Sessions')
      .doc(sessionID)
      .update({
        attendees: updatedAttendees,
        maxMentors: numberOfVolunteers,
        //   mentors: [], can't be updated from this view
        beach: location.name,
        beachID: location.id,
        type: sessionType,
        description: descriptionOfSession,
        dateTime: dateTimeArray[0].format(),
        coordinatorID: uid,
        coordinatorName: coordinator,
        regionID: location.region,
        updatedAt: firestore.FieldValue.serverTimestamp(),
        // Surf lead id
      })
      .then((session) => {
        console.log('Session updated!', session);
        resolve(session);
      })
      .catch((err) => {
        reject('Sessions were not updated');
      });
  });
};
