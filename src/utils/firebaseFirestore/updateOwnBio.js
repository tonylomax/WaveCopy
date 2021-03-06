import firestore from '@react-native-firebase/firestore';

export default updateOwnBio = async (bio, uid) => {
  await firestore()
    .collection('Users')
    .doc(uid)
    .update({bio, updatedAt: firestore.FieldValue.serverTimestamp()})
    .then(() => console.log('USER BIO UPDATED'))
    .catch((err) => console.log(err));
};
