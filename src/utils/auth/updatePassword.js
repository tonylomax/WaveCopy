import auth from '@react-native-firebase/auth';

export default changePassword = async (
  currentUser,
  currentPassword,
  newPassword,
) => {
  return new Promise(async (resolve, reject) => {
    const user = auth().currentUser;
    const credential = auth.EmailAuthProvider.credential(
      currentUser.email,
      currentPassword,
    );
    const userAuthenticated = await user
      .reauthenticateWithCredential(credential)
      .catch((err) => {
        reject({type: 'Authentication Error', err});
      });
    if (userAuthenticated) {
      console.log('Re-Authenticated');
      user
        .updatePassword(newPassword)
        .then(() => {
          console.log('password updated');
          resolve('password updated');
        })
        .catch((err) => {
          reject({type: 'Update password error', err});
        });
    }
  });
};
