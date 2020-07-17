import React, {useState} from 'react';
import {View, Text, Alert} from 'react-native';
import {serializeError} from 'serialize-error';

import {ConfirmButton} from 'components';
import {updatePassword, validatePassword, signOut} from 'utils';
import {Title, TextInput} from 'react-native-paper';

export default function ResetPassword({authenticatedUser}) {
  const [currentPassword, setCurrentPassword] = useState();
  const [newPassword, setNewPassword] = useState();
  const [confirmNewPassword, setConfirmNewPassword] = useState();
  const [newPasswordValid, setNewPasswordValid] = useState(false);

  return (
    <View>
      <TextInput
        secureTextEntry={true}
        autoCapitalize="none"
        onChangeText={(currentPasswordInput) =>
          setCurrentPassword(currentPasswordInput)
        }
        placeholder="Enter your current password"></TextInput>
      <TextInput
        secureTextEntry={true}
        autoCapitalize="none"
        onChangeText={(newPasswordInput) => setNewPassword(newPasswordInput)}
        placeholder="Enter your new passsword"></TextInput>
      <TextInput
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
                signOut();
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
}
