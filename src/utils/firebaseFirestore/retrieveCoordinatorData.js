import firestore from '@react-native-firebase/firestore';

export default async (coordinatorID) => {
  return new Promise(async (resolve, reject) => {
    try {
      const coordinator = await firestore()
        .collection('Users')
        .doc(coordinatorID)
        .get();
      resolve(coordinator._data);
    } catch (err) {
      reject(err);
    }
  });
};
