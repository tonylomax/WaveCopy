import firestore from '@react-native-firebase/firestore';

export default unassignSessionLead = async (sessionID, mentorID, userID) => {
  // Create a reference to the specific session doc.
  const sessionDocRef = firestore().collection('Sessions').doc(sessionID);
  const userDocRef = firestore().collection('Users').doc(userID);
  return await firestore()
    .runTransaction((transaction) => {
      // This code may get re-run multiple times if there are conflicts.
      return transaction.get(sessionDocRef).then(async (sessionDoc) => {
        // Check if the session lead id has been set.
        const sessionData = sessionDoc.data();
        const sessionRegion = sessionData.region;
        const sessionCoordinatorID = sessionData.coordinatorID;

        const userData = await userDocRef.get();
        const {roles, region} = userData.data();

        const mentorInSession = sessionData?.mentors?.findIndex((mentor) => {
          return mentor.id === mentorID;
        });

        if (sessionData?.sessionLead?.id === '') {
          throw 'Mentor has not been set';
        }

        if (mentorInSession < 0) {
          throw 'Mentor not in this session';
        }
        if (sessionData?.sessionLead?.id !== mentorID) {
          throw 'This mentor is not the current session lead';
        }
        if (roles.includes('NationalAdmin')) {
          transaction.update(sessionDocRef, {
            sessionLead: {
              id: '',
              createdAt: firestore.FieldValue.serverTimestamp(),
            },
          });
        } else if (
          roles.includes('RegionalManager') &&
          region === sessionRegion
        ) {
          transaction.update(sessionDocRef, {
            sessionLead: {
              id: '',
              createdAt: firestore.FieldValue.serverTimestamp(),
            },
          });
        } else if (
          roles.includes('Coordinator') &&
          sessionCoordinatorID === userID
        ) {
          transaction.update(sessionDocRef, {
            sessionLead: {
              id: '',
              createdAt: firestore.FieldValue.serverTimestamp(),
            },
          });
        } else {
          throw 'You need to be a Regional Manager or National Admin to unassign the session lead. Please contact session Coordinator to do this.';
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
