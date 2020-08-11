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

        const mentorInSession = sessionData?.mentors?.findIndex((mentor) => {
          return mentor.id === mentorID;
        });
        if (mentorInSession < 0) {
          throw 'This mentor is not in this session.';
        }
        if (sessionData?.sessionLead?.id !== '') {
          throw 'A session lead is already assigned, please remove them before assigning a new one.';
        }
        if (roles.includes('NationalAdmin')) {
          transaction.update(sessionDocRef, {
            sessionLead: {
              id: mentorID,
              createdAt: firestore.FieldValue.serverTimestamp(),
            },
          });
        } else if (
          roles.includes('RegionalManager') &&
          region === sessionRegion
        ) {
          transaction.update(sessionDocRef, {
            sessionLead: {
              id: mentorID,
              createdAt: firestore.FieldValue.serverTimestamp(),
            },
          });
        } else if (roles.includes('Coordinator')) {
          transaction.update(sessionDocRef, {
            sessionLead: {
              id: mentorID,
              createdAt: firestore.FieldValue.serverTimestamp(),
            },
          });
        } else {
          throw 'You need to be a Regional Manager or National Admin to assign the session lead. Please contact session Coordinator to do this.';
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
