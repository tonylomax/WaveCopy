import firestore from '@react-native-firebase/firestore';
import moment from 'moment';
import 'moment/src/locale/en-gb';
moment.locale('en-gb');
moment().format('en-gb');

export default signupForSession = async (sessionID, userID) => {
  const sessionReference = firestore().doc(`Sessions/${sessionID}`);

  return firestore().runTransaction(async (signupTransaction) => {
    return signupTransaction
      .get(sessionReference)
      .then((sessionData) => {
        if (!sessionData.exists) {
          throw 'Session does not exist!';
        } else if (
          sessionData.data().Mentors.filter((mentor) => mentor.id === userID)
            .length > 0
        ) {
          throw 'You are already in this session';
        } else if (
          sessionData.data().Mentors.length >= sessionData.data().MaxMentors
        ) {
          throw 'Session is full!';
        } else {
          signupTransaction.update(sessionReference, {
            Mentors: [
              ...sessionData.data().Mentors,
              {
                Attended: false,
                id: userID,
                signupAt: moment(new Date()).format('DD-MM-YYYY hh:mm:ss'),
              },
            ],
          });
        }
      })
      .then(() => console.log('SIGNUP TRANSACTION COMPLETED'))
      .catch((err) => {
        console.log(err);
      });
  });
};
