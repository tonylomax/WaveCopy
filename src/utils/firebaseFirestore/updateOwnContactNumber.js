import firestore from '@react-native-firebase/firestore';

export default updateOwnContactNumber = async (newNumber, uid) => {
  await firestore()
    .collection('Users')
    .doc(uid)
    .update({ContactNumber: newNumber})
    .then(() => console.log('USER CONTACT NUMBER UPDATED'))
    .catch((err) => console.log(err));
};
