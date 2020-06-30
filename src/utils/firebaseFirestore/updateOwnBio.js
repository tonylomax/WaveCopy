import firestore from '@react-native-firebase/firestore';

export default async function updateOwnBio(bio, uid) {
  // console.log('uid', uid);
  await firestore()
    .collection('Users')
    .doc(uid)
    .update({Bio: bio})
    .then(() => console.log('USER BIO UPDATED'));
}