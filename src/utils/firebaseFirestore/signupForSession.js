import firestore from '@react-native-firebase/firestore';
import moment from 'moment';
import 'moment/src/locale/en-gb';
moment.locale('en-gb');
moment().format('en-gb');

export default signupForSession = async (sessionID, userID) => {
  const sessionReference = firestore().doc(`Sessions/${sessionID}`);

  return await firestore().runTransaction(async (signupTransaction) => {
    return signupTransaction
      .get(sessionReference)
      .then((sessionData) => {
        if (!sessionData.exists) {
          throw 'Session does not exist!';
        } else if (
          sessionData.data().mentors.filter((mentor) => mentor.id === userID)
            .length > 0
        ) {
          throw 'You are already in this session';
        } else if (
          sessionData.data().mentors.length >= sessionData.data().maxMentors
        ) {
          throw 'Session is full!';
        } else {
          signupTransaction.update(sessionReference, {
            mentors: [
              ...sessionData.data().mentors,
              {
                attended: false,
                id: userID,
                signupAt: moment(new Date()).format('DD-MM-YYYY hh:mm:ss'),
              },
            ],
          });
        }
      })
      .then((result) => {
        console.log('SIGNUP TRANSACTION COMPLETED');
        return result;
      })
      .catch((err) => {
        console.log('ERROR INSIDE TRANSACTION', err);
        throw err;
      });
  });
};
