import firestore from '@react-native-firebase/firestore';

export default toggleIsNewUser = async (uid) => {
  await firestore()
    .collection('Users')
    .doc(uid)
    .update({isNewUser: false})
    .then(() => console.log('IS_NEW_USER TOGGLED'))
    .catch((err) => console.log(err));
};
