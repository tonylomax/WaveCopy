import React, {useEffect, useState} from 'react';
import {View, Text, SafeAreaView, TouchableOpacity} from 'react-native';
import {ConfirmButton} from 'components';
import {signOut} from 'utils';
import {useSelector, useDispatch} from 'react-redux';
import {TextInput} from 'react-native-gesture-handler';
import {updateBio} from 'utils';

export default function Profile({navigation}) {
  const userData = useSelector((state) => state.firestoreReducer.userData);
  const [bio, setBio] = useState(userData.Bio);
  const UID = useSelector((state) => state.authenticationReducer.userState.uid);

  const [edit, setEdit] = useState(false);
  useEffect(() => {
    console.log('userData', userData);
  }, [userData]);

  return (
    <SafeAreaView>
      <View>
        <ConfirmButton
          testID="signOutButton"
          onPress={() => {
            signOut();
          }}
          title="signout"></ConfirmButton>
        <TouchableOpacity
          onPress={() => {
            setEdit((edit) => !edit);
          }}>
          {edit ? (
            <TextInput
              onChangeText={(updatedBio) => {
                setBio(updatedBio);
              }}
              autoFocus={true}
              defaultValue={userData.Bio}></TextInput>
          ) : (
            <Text testID="bio">Bio: {bio}</Text>
          )}
        </TouchableOpacity>

        <ConfirmButton
          onPress={() => {
            setEdit(false);
            updateBio(bio, UID);
          }}
          title="Done"></ConfirmButton>
        <Text testID="firestoreName">Name: {userData.Name} </Text>
      </View>
    </SafeAreaView>
  );
}
