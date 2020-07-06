import firestore from '@react-native-firebase/firestore';

export default markAttendance = async (
  sessionID,
  userID,
  sessionData,
  attendeeGroup,
) => {
  const updatedRegister = sessionData[attendeeGroup].map((attendee) => {
    if (attendee.id === userID) {
      return {...attendee, Attended: !attendee.Attended};
    } else return attendee;
  });
  console.log('updatedRegister', updatedRegister);
  await firestore()
    .collection('Sessions')
    .doc(sessionID)
    .update({[attendeeGroup]: updatedRegister})
    .then(() => console.log('REGISTER MARKED'));
};