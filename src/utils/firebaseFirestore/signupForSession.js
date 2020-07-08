import firestore from '@react-native-firebase/firestore';

export default signupForSession = async (sessionID, userID) => {
  console.log('signupForSession called', sessionID, userID);

  return new Promise(async (resolve, reject) => {
    const sessionReference = firestore().doc(`Sessions/${sessionID}`);
    console.log('sessionReference', sessionReference);

    firestore()
      .runTransaction(async (transaction) => {
        // Get post data first
        const sessionData = await transaction.get(sessionReference);
        console.log('transaction sessionData ', sessionData.data());

        if (!sessionData.exists) {
          reject('Session does not exist!');

          transaction.update(sessionReference, {
            Mentors: [...sessionData.data().Mentors],
          });
        } else if (
          sessionData.data().Mentors.length >= sessionData.data().MaxMentors
        ) {
          reject('Session is full!');
          transaction.update(sessionReference, {
            Mentors: [...sessionData.data().Mentors],
          });
        } else {
          transaction.update(sessionReference, {
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
