import firestore from '@react-native-firebase/firestore';

export default function (sessionID, mentorID) {
  // Create a reference to the specific session doc.
  var sessionDocRef = firestore().collection('Sessions').doc(sessionID);

  return firestore()
    .runTransaction(function (transaction) {
      // This code may get re-run multiple times if there are conflicts.
      return transaction.get(sessionDocRef).then(function (sessionDoc) {
        // Check if the session lead id has been set.
        const sessionData = sessionDoc.data();
        const mentorInSession = sessionData.Mentors.findIndex((mentor) => {
          return mentor.id === mentorID;
        });
        if (sessionData.SessionLead.id === '') {
          throw 'Mentor has not been set';
        }
        if (mentorInSession < 0) {
          throw 'Mentor not in this session';
        }
        if (sessionData.SessionLead.id !== mentorID) {
          throw 'This mentor is not the current session lead';
        }

        transaction.update(sessionDocRef, {
          SessionLead: {
            id: '',
            CreatedAt: firestore.FieldValue.serverTimestamp(),
          },
        });
      });
    })
    .then(function () {
      console.log('Transaction successfully committed!');
    })
    .catch(function (error) {
      console.log('Transaction failed: ', error);
    });
}
