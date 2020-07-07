import firestore from '@react-native-firebase/firestore';

export default returnSessionAttendees = async (attendeesArray, collection) => {
  console.log('returnSessionAttendees', attendeesArray, collection);

  return new Promise(async (resolve, reject) => {
    console.log({attendeesArray});
    if (attendeesArray === undefined) {
      reject('attendeesArray is undefined');
    }
    try {
      const resolvedUsers = await Promise.all(
        attendeesArray.map(async (user) => {
          console.log('user', user.id);
          const userPromise = await firestore()
            .collection(collection)
            .doc(user.id)
            .get();

          return userPromise;
        }),
      );
      resolve(resolvedUsers);
    } catch (err) {
      reject(err);
    }
  });
};
