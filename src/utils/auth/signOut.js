import auth from '@react-native-firebase/auth';
export default async function signOut() {
  return auth().signOut();
}
