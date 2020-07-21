import firestore from '@react-native-firebase/firestore';

export default addNotificationToken = (uid, token) => {
  console.log('is there a token, inside addnotificationtoken');
  console.log('send token to server ', token);
  firestore()
    .collection('Users')
    .doc(uid)
    .update({
      tokens: firestore.FieldValue.arrayUnion(token),
    })
    .then(() => console.log('USER TOKEN UPDATED'))
    .catch((err) => console.log(err));
};
