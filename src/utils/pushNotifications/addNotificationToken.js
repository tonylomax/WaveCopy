import firestore from '@react-native-firebase/firestore';

export default addNotificationToken = (uid, token) => {
  console.log('Calling addNotificationToken');
  firestore()
    .collection('Users')
    .doc(uid)
    .update({
      tokens: firestore.FieldValue.arrayUnion(token),
    })
    .then(() => console.log('USER TOKEN UPDATED'))
    .catch((err) => console.log('error in addNotificationToken', err));
};
