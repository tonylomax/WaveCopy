import auth from '@react-native-firebase/auth';

export default async function loginWithEmail(email, password) {
  return await auth()
    .signInWithEmailAndPassword(email, password)
    .then((user) => {
      console.log('USER SIGNED IN', user);
      return user;
    })
    .catch((error) => {
      if (error.code === 'auth/email-already-in-use') {
        console.log('That email address is already in use!');
        return error;
      }
      if (error.code === 'auth/invalid-email') {
        console.log('That email address is invalid!');
        return error;
      }
      console.error(error);
    });
}
