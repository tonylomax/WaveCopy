import firestore from '@react-native-firebase/firestore';

export default returnSessionAttendees = async (attendeesArray) => {
  return new Promise(async (resolve, reject) => {
    try {
      let resolvedUsers = await Promise.all(
        attendeesArray.map(async (user) => {
          const userPromise = await firestore()
            .collection('ServiceUsers')
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
