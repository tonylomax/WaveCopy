import firestore from '@react-native-firebase/firestore';
import 'react-native-get-random-values';
import {v1 as uuidv1} from 'uuid';

export default createSessionInFirestore = ({
  sessionType,
  location,
  numberOfVolunteers,
  selectedServiceUsers,
  dateTimeArray,
  descriptionOfSession,
  coordinator,
  uid,
  sessionID,
}) => {
  return new Promise((resolve, reject) => {
    const updatedAttendees = [];
    selectedServiceUsers.map((user) => {
      updatedAttendees.push({
        id: user.objectID || user.id,
        Attended: false,
      });
    });
    console.log('location', location.id);
    firestore()
      .collection('Sessions')
      .doc(sessionID)
      .update({
        Attendees: updatedAttendees,
        MaxMentors: numberOfVolunteers,
        //   Mentors: [], can't be updated from this view
        Beach: location.Name,
        BeachID: location.id,
        Type: sessionType,
        Description: descriptionOfSession,
        DateTime: dateTimeArray[0].format(),
        CoordinatorID: uid,
        CoordinatorName: coordinator,
        RegionID: location.Region,
        UpdatedAt: firestore.FieldValue.serverTimestamp(),
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
