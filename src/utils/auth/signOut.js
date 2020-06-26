import auth from '@react-native-firebase/auth';

export default async function signOut() {
  return await auth()
    .signOut()
    .then(() => console.log('User signed out!'));
}
