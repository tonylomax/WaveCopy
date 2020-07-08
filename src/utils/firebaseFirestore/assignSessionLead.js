import firestore from '@react-native-firebase/firestore';

export default function (sessionID, mentorID) {
  // Create a reference to the specific session doc.
  var sessionDocRef = firestore().collection('Sessions').doc(sessionID);

  return firestore()
    .runTransaction(function (transaction) {
      // This code may get re-run multiple times if there are conflicts.
      console.log('running the transaction');
      return transaction.get(sessionDocRef).then(function (sessionDoc) {
        // Check if the session lead id has been set.
        const sessionData = sessionDoc.data();
        const mentorInSession = sessionData.Mentors.findIndex((mentor) => {
          return mentor.id === mentorID;
        });
        if (mentorInSession < 0) {
          throw 'Mentor not in this session';
        }
        if (sessionData.SessionLead.id !== '') {
          throw 'Already a session lead assigned';
        }

        transaction.update(sessionDocRef, {
          SessionLead: {
            id: mentorID,
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
