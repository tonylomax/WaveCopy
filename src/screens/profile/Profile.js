import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
} from 'react-native';
import {ConfirmButton, ImageConfirmPopup} from 'components';
import {signOut} from 'utils';
import {useSelector, useDispatch} from 'react-redux';
import {TextInput} from 'react-native-gesture-handler';
import {updateBio, getDownloadURI} from 'utils';
import {Edit_Icon} from 'assets';
import ImagePicker from 'react-native-image-picker';
import {uploadFile} from 'utils';

export default function Profile({navigation}) {
  const userData = useSelector((state) => state.firestoreReducer.userData);
  const [bio, setBio] = useState(userData.Bio);
  const UID = useSelector((state) => state.authenticationReducer.userState.uid);
  const [profileURL, setProfileURL] = useState();
  const [edit, setEdit] = useState(false);
  const [imageConfirmPopup, setImageConfirmPopup] = useState(false);
  const [localFilePath, setLocalFilePath] = useState();
  const [options, setOptions] = useState({
    title: 'Select Avatar',
    storageOptions: {
      skipBackup: true,
      path: 'images',
    },
    noData: true,
  });
  const [uploadImg, setUploadImg] = useState();

  const getFileLocalPath = (response) => {
    const {path, uri} = response;
    return Platform.OS === 'android' ? path : uri;
  };

  useEffect(() => {
    getDownloadURI(UID).then((url) => {
      setProfileURL(url);
    });
  }, []);

  useEffect(() => {
    console.log('uploadImg', uploadImg);
  }, [uploadImg]);

  const imagePicker = () => {
    ImagePicker.showImagePicker(options, (response) => {
      console.log('Response = ', response);
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        setUploadImg({uri: response.uri});
        setLocalFilePath(getFileLocalPath(response));
        const fileSize = response.fileSize;

        //To-Do: determine max image file size we'll allow
        // if (fileSize > 10000) {
        //   Alert.alert(
        //     'Image is too big, please select a lower quality image',
        //   );
        // } else

        //display the image and if they click yes then start the upload

        setImageConfirmPopup(true);
      }
    });
  };

  return (
    <SafeAreaView>
      <View>
        <ImageConfirmPopup
          visible={imageConfirmPopup}
          setVisible={setImageConfirmPopup}
          imgSource={uploadImg?.uri}
          localFilePath={localFilePath}
          UID={UID}
          // yesAction={() => {
          //   // return await uploadFile(localFilePath, UID);

          //   uploadFile(localFilePath, UID);
          // }}
        ></ImageConfirmPopup>
        <ConfirmButton
          testID="signOutButton"
          onPress={() => {
            signOut();
          }}
          title="signout"></ConfirmButton>
        <Image
          style={{height: '10%', width: '10%'}}
          source={{
            uri: profileURL,
          }}></Image>

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

        <ConfirmButton
          title="Upload image"
          onPress={() => {
            imagePicker();
          }}
        />
      </View>
    </SafeAreaView>
  );
}
