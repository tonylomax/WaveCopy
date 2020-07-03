import firestore from '@react-native-firebase/firestore';
// import auth from '@react-native-firebase/auth';

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
        firstName: user.firstName,
        lastName: user.lastName,
        id: user.objectID,
      });
    });
    console.log(updatedAttendees);

    dateTimeArray.map((sessionDate, i) => {
      firestore()
        .collection('Sessions')
        .add({
          Attendees: updatedAttendees,
          MaxMentors: numberOfVolunteers,
          Beach: location.Name,
          Type: sessionType,
          Description: descriptionOfSession,
          DateTime: sessionDate.format(),
          CoordinatorID: uid,
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
