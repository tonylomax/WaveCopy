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
        //   Mentors: [], can't be updated from this view
        beach: location.Name,
        beachID: location.id,
        type: sessionType,
        description: descriptionOfSession,
        dateTime: dateTimeArray[0].format(),
        coordinatorID: uid,
        coordinatorName: coordinator,
        regionID: location.Region,
        updatedAt: firestore.FieldValue.serverTimestamp(),
        // Surf lead ID
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
