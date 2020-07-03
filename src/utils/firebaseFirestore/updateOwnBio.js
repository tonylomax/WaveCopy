import firestore from '@react-native-firebase/firestore';

export default updateOwnBio = async (bio, uid) => {
  await firestore()
    .collection('Users')
    .doc(uid)
    .update({Bio: bio})
    .then(() => console.log('USER BIO UPDATED'));
};
