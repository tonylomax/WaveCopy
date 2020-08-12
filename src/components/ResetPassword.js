import React, {useState} from 'react';
import {View, Text, Alert} from 'react-native';
import {serializeError} from 'serialize-error';
import auth from '@react-native-firebase/auth';

import {ConfirmButton} from 'components';
import {updatePassword, validatePassword, signOut, validateEmail} from 'utils';
import {Title, TextInput} from 'react-native-paper';

export default function ResetPassword({authenticatedUser, mode, dismiss}) {
  const [currentPassword, setCurrentPassword] = useState();
  const [newPassword, setNewPassword] = useState();
  const [confirmNewPassword, setConfirmNewPassword] = useState();
  const [confirmEmail, setConfirmEmail] = useState();
  const [newPasswordValid, setNewPasswordValid] = useState(false);
  const [loadingIcon, setLoadingIcon] = useState(false);
  console.log('mode', mode);
  if (mode === 'change') {
    return (
      <View>
        <TextInput
          mode="outlined"
          secureTextEntry={true}
          autoCapitalize="none"
          onChangeText={(currentPasswordInput) =>
            setCurrentPassword(currentPasswordInput)
          }
          placeholder="Enter your current password"></TextInput>
        <TextInput
          mode="outlined"
          secureTextEntry={true}
          autoCapitalize="none"
          onChangeText={(newPasswordInput) => setNewPassword(newPasswordInput)}
          placeholder="Enter your new passsword"></TextInput>
        <TextInput
          style={{marginBottom: '2%'}}
          mode="outlined"
          secureTextEntry={true}
          autoCapitalize="none"
          onChangeText={(confirmNewPasswordInput) => {
            setConfirmNewPassword(confirmNewPasswordInput);
            setNewPasswordValid(validatePassword(newPassword));
          }}
          placeholder="Confirm your new password"></TextInput>
        <ConfirmButton
          title="Change Password"
          onPress={() => {
            if (newPasswordValid && newPassword === confirmNewPassword) {
              updatePassword(authenticatedUser, currentPassword, newPassword)
                .then(() => {
                  signOut().then(() => {
                    dispatch(updateRoleSpecificSessions([]));
                    dispatch(updateSessions([]));
                    dispatch(updateFirestoreUserData({}));
                  });
                })
                .catch((err) => {
                  const serializedResult = serializeError(err);
                  console.log('serializedResult');
                  Alert.alert(serializedResult.err.message);
                });
            } else if (!newPasswordValid) {
              console.log('New password invalid');
              Alert.alert('New password invalid');
            } else if (newPassword !== confirmNewPassword) {
              console.log('New passwords don"t match');
              Alert.alert('New passwords don"t match');
            }
          }}></ConfirmButton>
      </View>
    );
  } else {
    return (
      <View>
        <TextInput
          style={{marginBottom: '2%'}}
          mode="outlined"
          autoCapitalize="none"
          onChangeText={(confirmEmail) => {
            setConfirmEmail(confirmEmail);
          }}
          placeholder="Enter your email"></TextInput>
        <ConfirmButton
          loading={loadingIcon}
          title="Request Reset"
          onPress={() => {
            emailValid = validateEmail(confirmEmail);
            if (emailValid) {
              setLoadingIcon((loadingIcon) => !loadingIcon);
              auth()
                .sendPasswordResetEmail(confirmEmail)
                .then((result) => {
                  console.log({result});
                  Alert.alert(
                    'Password Reset Confirmed',
                    'If an account is found for this email address, a password reset email will be sent.',
                  );
                  dismiss();
                })
                .catch((err) => {
                  console.log(err);
                });
            } else {
              Alert.alert('This is not a valid email address.');
            }
          }}></ConfirmButton>
      </View>
    );
  }
}
