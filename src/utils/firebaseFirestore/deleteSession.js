import firestore from '@react-native-firebase/firestore';

export default function (sessionID, userID) {
  // Create a reference to the specific session doc.
  console.log({sessionID});
  console.log({userID});

  const sessionDocRef = firestore().collection('Sessions').doc(sessionID);

  const userDocRef = firestore().collection('Users').doc(userID);

  return firestore()
    .runTransaction(function (transaction) {
      // This code may get re-run multiple times if there are conflicts.
      console.log('running the transaction');
      return transaction.get(sessionDocRef).then(async function (sessionDoc) {
        const userData = await userDocRef.get();
        const {roles, region} = userData.data();

        const sessionData = sessionDoc.data();
        console.log('deleting session', sessionData);
        const sessionCoordinatorID = sessionData.CoordinatorID;
        const sessionRegion = sessionData.region;

        if (roles.includes('NationalAdmin')) {
          console.log('deleting because youre a national admin');
          transaction.delete(sessionDocRef);
        } else if (
          roles.includes('RegionalManager') &&
          region === sessionRegion
        ) {
          console.log('deleting because youre a regional manager');
          transaction.delete(sessionDocRef);
        } else if (
          roles.includes('Coordinator') &&
          sessionCoordinatorID === userID
        ) {
          console.log('deleting because youre a coordinator');
          transaction.delete(sessionDocRef);
        } else {
          throw `Do not have permsissions to delete this session`;
        }
      });
    })
    .then(function () {
      console.log(
        `Transaction successfully - session ${sessionID} was deleted`,
      );
    })
    .catch(function (error) {
      console.log('Transaction failed: ', error);
    });
}

// const db = firebase.firestore();  //or admin.firestore() in a Cloud Function
// const docRef1 = db.collection('classrooms').doc('classroomDocId');
// const docRef2 = db.collection('students').doc('studentDocId');

// let transaction = db.runTransaction(t => {
//   let newNumericValue;
//   return t.get(docRef1 )
//     .then(doc => {
//       newNumericValue = doc.data().numericValue + 1;  //You calculate the new value
//       return t.update(docRef1 , {numericValue : newNumericValue});
//     }).then(t => {
//       return t.update(docRef2 , {numericValue : newNumericValue});
//     });
// }).then(result => {
//   console.log('Transaction success!' + result);
// }).catch(err => {
//   console.log('Transaction failure:', err);
// });
