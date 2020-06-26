import React, {useEffect, useState} from 'react';
import {View, Text, SafeAreaView, TouchableOpacity, Image} from 'react-native';
import {ConfirmButton} from 'components';
import {signOut} from 'utils';
import {useSelector, useDispatch} from 'react-redux';
import {TextInput} from 'react-native-gesture-handler';
import {updateBio} from 'utils';
import storage from '@react-native-firebase/storage';
import Edit_Icon from '../../assets/images/icons/index';

export default function Profile({navigation}) {
  const userData = useSelector((state) => state.firestoreReducer.userData);
  const [bio, setBio] = useState(userData.Bio);
  const UID = useSelector((state) => state.authenticationReducer.userState.uid);
  const [profileURL, setProfileURL] = useState();
  const [edit, setEdit] = useState(false);

  const getDownloadUrl = async () => {
    return new Promise((resolve, reject) => {
      const ref = storage().ref('/ProfilePics/IMG_4581.JPG');
      const downloadURL = ref.getDownloadURL();
      return downloadURL
        .then((downloadURL) => {
          resolve(downloadURL);
        })
        .catch((err) => {
          reject(err);
        });
    });
  };

  useEffect(() => {
    console.log('userData', userData);
    console.log('Edit_Icon', Edit_Icon);
  }, [userData]);

  useEffect(() => {
    getDownloadUrl().then((url) => {
      setProfileURL(url);
    });
  }, []);

  return (
    <SafeAreaView>
      <View>
        <Image source={require(Edit_Icon)}></Image>
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
