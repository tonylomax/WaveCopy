import firestore from '@react-native-firebase/firestore';

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
              {Attended: false, id: userID},
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
