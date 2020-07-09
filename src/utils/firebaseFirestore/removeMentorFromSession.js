import firestore from '@react-native-firebase/firestore';
import moment from 'moment';
import 'moment/src/locale/en-gb';
moment.locale('en-gb');
moment().format('en-gb');

export default removeMentorFromSession = async (
  sessionID,
  userID,
  UID,
  sessionleadID,
) => {
  const sessionReference = firestore().doc(`Sessions/${sessionID}`);

  firestore()
    .runTransaction(async (removeMentorFromSessionTransaction) => {
      const sessionData = await removeMentorFromSessionTransaction.get(
        sessionReference,
      );
      const newMentors = sessionData
        .data()
        .Mentors.filter((mentor) => mentor.id !== userID);

      if (!sessionData.exists) {
        throw 'Session does not exist!';
      }
      if (userID === UID) {
        throw 'You cannot remove yourself as a mentor, please contact the coordinator to remove you';
      }
      if (sessionleadID === userID) {
        throw 'Remove this person from session lead before you remove them from session';
      } else {
        removeMentorFromSessionTransaction.update(sessionReference, {
          Mentors: newMentors,
        });
      }
    })
    .then(() => console.log('REMOVE MENTOR FROM SESSION TRANSACTION COMPLETED'))
    .catch((err) => {
      console.log(err);
    });
};
