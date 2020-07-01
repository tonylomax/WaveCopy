import firestore from '@react-native-firebase/firestore';

export default markAttendance = async (sessionID, userID, sessionData) => {
  console.log('mark attendence', sessionData.Attendees);
  const updatedRegister = sessionData.Attendees.map((attendee) => {
    if (attendee.id === userID) {
      return {...attendee, Attended: !attendee.Attended};
    } else return attendee;
  });
  console.log('updatedRegister', updatedRegister);
  await firestore()
    .collection('Sessions')
    .doc(sessionID)
    .update({Attendees: updatedRegister})
    .then(() => console.log('REGISTER MARKED'));
};
