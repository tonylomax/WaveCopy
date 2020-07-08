import firestore from '@react-native-firebase/firestore';

export default signupForSession = async (sessionID, userID) => {
  console.log('signupForSession called', sessionID, userID);

  return new Promise(async (resolve, reject) => {
    const sessionReference = firestore().doc(`Sessions/${sessionID}`);
    console.log('sessionReference', sessionReference);

    firestore()
      .runTransaction(async (signupTransaction) => {
        const sessionData = await signupTransaction.get(sessionReference);
        console.log('transaction sessionData ', sessionData.data());

        if (!sessionData.exists) {
          reject('Session does not exist!');

          signupTransaction.update(sessionReference, {
            Mentors: [...sessionData.data().Mentors],
          });
        } else if (
          sessionData.data().Mentors.filter((mentor) => mentor.id === userID)
            .length > 0
        ) {
          reject('You are already in this session');
        } else if (
          sessionData.data().Mentors.length >= sessionData.data().MaxMentors
        ) {
          reject('Session is full!');
          signupTransaction.update(sessionReference, {
            Mentors: [...sessionData.data().Mentors],
          });
        } else {
          signupTransaction.update(sessionReference, {
            Mentors: [
              ...sessionData.data().Mentors,
              {Attended: false, id: userID},
            ],
          });
        }
      })
      .then(() => resolve('SIGNUP TRANSACTION COMPLETED'))
      .catch((err) => {
        reject(err);
      });
  });
};
