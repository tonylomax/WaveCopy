import firestore from '@react-native-firebase/firestore';

export default function (sessionID, mentorID, userID) {
  // Create a reference to the specific session doc.
  const sessionDocRef = firestore().collection('Sessions').doc(sessionID);
  const userDocRef = firestore().collection('Users').doc(userID);
  return firestore()
    .runTransaction(function (transaction) {
      // This code may get re-run multiple times if there are conflicts.
      return transaction.get(sessionDocRef).then(async function (sessionDoc) {
        // Check if the session lead id has been set.
        const sessionData = sessionDoc.data();
        const sessionRegion = sessionData.Region;
        const sessionCoordinatorID = sessionData.CoordinatorID;

        const userData = await userDocRef.get();
        const {Roles, Region} = userData.data();

        const mentorInSession = sessionData.Mentors.findIndex((mentor) => {
          return mentor.id === mentorID;
        });

        if (sessionData?.SessionLead?.id === '') {
          throw 'Mentor has not been set';
        }

        if (mentorInSession < 0) {
          throw 'Mentor not in this session';
        }
        if (sessionData?.SessionLead?.id !== mentorID) {
          throw 'This mentor is not the current session lead';
        }
        if (Roles.includes('NationalAdmin')) {
          transaction.update(sessionDocRef, {
            SessionLead: {
              id: '',
              CreatedAt: firestore.FieldValue.serverTimestamp(),
            },
          });
        } else if (
          Roles.includes('RegionalManager') &&
          Region === sessionRegion
        ) {
          transaction.update(sessionDocRef, {
            SessionLead: {
              id: '',
              CreatedAt: firestore.FieldValue.serverTimestamp(),
            },
          });
        } else if (
          Roles.includes('Coordinator') &&
          sessionCoordinatorID === userID
        ) {
          transaction.update(sessionDocRef, {
            SessionLead: {
              id: '',
              CreatedAt: firestore.FieldValue.serverTimestamp(),
            },
          });
        } else {
          throw 'you dont have permission';
        }
      });
    })
    .then(function () {
      console.log('Transaction successfully committed!');
    })
    .catch(function (error) {
      console.log('Transaction failed: ', error);
    });
}
