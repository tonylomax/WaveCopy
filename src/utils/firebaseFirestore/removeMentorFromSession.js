import firestore from '@react-native-firebase/firestore';
import moment from 'moment';
import 'moment/src/locale/en-gb';
moment.locale('en-gb');
moment().format('en-gb');

export default removeMentorFromSession = async (sessionID, userID) => {
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
