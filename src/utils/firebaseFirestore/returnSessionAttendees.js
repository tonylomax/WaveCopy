import firestore from '@react-native-firebase/firestore';

export default returnSessionAttendees = async (personArray, collection) => {
  console.log('returnSessionAttendees', personArray, collection);

  return new Promise(async (resolve, reject) => {
    try {
      let resolvedUsers = await Promise.all(
        personArray.map(async (user) => {
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
