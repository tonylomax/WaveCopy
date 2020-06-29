import React, {useEffect, useState} from 'react';
import {View, Text, SafeAreaView, TouchableOpacity, Image} from 'react-native';
import {ConfirmButton} from 'components';
import {signOut} from 'utils';
import {useSelector, useDispatch} from 'react-redux';
import {TextInput} from 'react-native-gesture-handler';
import {updateBio, getDownloadURI} from 'utils';
import {Edit_Icon} from 'assets';

export default function Profile({navigation}) {
  const userData = useSelector((state) => state.firestoreReducer.userData);
  const [bio, setBio] = useState(userData.Bio);
  const UID = useSelector((state) => state.authenticationReducer.userState.uid);
  const [profileURL, setProfileURL] = useState();
  const [edit, setEdit] = useState(false);

  useEffect(() => {
    console.log('userData', UID);
    console.log('Edit_Icon', Edit_Icon);
  }, [userData]);

  useEffect(() => {
    getDownloadURI(UID).then((url) => {
      setProfileURL(url);
    });
  }, []);

  return (
    <SafeAreaView>
      <View>
        <ConfirmButton
          testID="signOutButton"
          onPress={() => {
            signOut();
          }}
          title="signout"></ConfirmButton>
        <Image
          style={{height: '50%', width: '50%'}}
          source={{
            uri: profileURL,
          }}></Image>
        <TouchableOpacity>
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
        <TouchableOpacity
          onPress={() => {
            setEdit((edit) => !edit);
          }}
          style={{height: '15%', width: '15%'}}>
          <Image
            style={{height: '75%', width: '75%'}}
            source={Edit_Icon}></Image>
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
