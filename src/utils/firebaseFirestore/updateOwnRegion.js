import firestore from '@react-native-firebase/firestore';

export default updateOwnRegion = async (regionID, uid) => {
  await firestore()
    .collection('Users')
    .doc(uid)
    .update({region: regionID})
    .then(() => console.log('USER region UPDATED'))
    .catch((err) => console.log(err));
};
