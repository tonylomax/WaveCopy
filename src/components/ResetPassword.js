import React, {useState} from 'react';
import {TextInput, View, Text} from 'react-native';
import {COLOURS} from 'styles';
import {ConfirmButton} from 'components';
import {updatePassword, validatePassword, signOut} from 'utils';

export default function ResetPassword({authenticatedUser}) {
  const [currentPassword, setCurrentPassword] = useState();
  const [newPassword, setNewPassword] = useState();
  const [confirmNewPassword, setConfirmNewPassword] = useState();
  const [newPasswordValid, setNewPasswordValid] = useState(false);

  return (
    <View>
      <Text> You can change your password </Text>
      <TextInput
        autoCapitalize="none"
        onChangeText={(currentPasswordInput) =>
          setCurrentPassword(currentPasswordInput)
        }
        placeholder="Enter your current password"></TextInput>
      <TextInput
        autoCapitalize="none"
        onChangeText={(newPasswordInput) => setNewPassword(newPasswordInput)}
        placeholder="Enter your new passsword"></TextInput>
      <TextInput
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
              .catch((err) => console.log(err));
          } else if (!newPasswordValid) {
            console.log('New password invalid');
          } else if (newPassword !== confirmNewPassword) {
            console.log('New passwords don"t match');
          }
        }}></ConfirmButton>
    </View>
  );
}
