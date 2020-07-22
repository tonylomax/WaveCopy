import firestore from '@react-native-firebase/firestore';

export default updateOwnRegion = async (regionID, uid) => {
  await firestore()
    .collection('Users')
    .doc(uid)
    .update({Region: regionID})
    .then(() => console.log('USER region UPDATED'))
    .catch((err) => console.log(err));
};
