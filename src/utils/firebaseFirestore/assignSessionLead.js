import firestore from '@react-native-firebase/firestore';

export default assignSessionLead = async (sessionID, mentorID, userID) => {
  // Create a reference to the specific session doc.
  const sessionDocRef = firestore().collection('Sessions').doc(sessionID);
  const userDocRef = firestore().collection('Users').doc(userID);

  return await firestore()
    .runTransaction(async (transaction) => {
      // This code may get re-run multiple times if there are conflicts.
      console.log('running the transaction');
      return transaction.get(sessionDocRef).then(async (sessionDoc) => {
        // Check if the session lead id has been set.
        const userData = await userDocRef.get();
        const {roles, region} = userData.data();

        const sessionData = sessionDoc.data();
        const sessionRegion = sessionData.region;
        const sessionCoordinatorID = sessionData.CoordinatorID;

        const mentorInSession = sessionData.Mentors.findIndex((mentor) => {
          return mentor.id === mentorID;
        });
        if (mentorInSession < 0) {
          throw 'Mentor not in this session';
        }
        if (sessionData?.SessionLead?.id !== '') {
          throw 'Already a session lead assigned';
        }
        if (roles.includes('NationalAdmin')) {
          transaction.update(sessionDocRef, {
            SessionLead: {
              id: mentorID,
              CreatedAt: firestore.FieldValue.serverTimestamp(),
            },
          });
        } else if (
          roles.includes('RegionalManager') &&
          region === sessionRegion
        ) {
          transaction.update(sessionDocRef, {
            SessionLead: {
              id: mentorID,
              CreatedAt: firestore.FieldValue.serverTimestamp(),
            },
          });
        } else if (
          roles.includes('Coordinator') &&
          sessionCoordinatorID === userID
        ) {
          transaction.update(sessionDocRef, {
            SessionLead: {
              id: mentorID,
              CreatedAt: firestore.FieldValue.serverTimestamp(),
            },
          });
        } else {
          throw 'you dont have permission';
        }
      });
    })
    .then((result) => {
      console.log('Transaction successfully committed!');
      return result;
    })
    .catch((error) => {
      console.log('Transaction failed: ', error);
      throw error;
    });
};
