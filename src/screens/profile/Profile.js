import React, {useEffect, useState} from 'react';
import {View, Text, SafeAreaView, TouchableOpacity, Image} from 'react-native';
import {ConfirmButton, ImageConfirmPopup} from 'components';
import {useSelector, useDispatch} from 'react-redux';
import {TextInput} from 'react-native-gesture-handler';
import {Edit_Icon} from 'assets';
import ImagePicker from 'react-native-image-picker';
import {
  uploadFile,
  monitorFileUpload,
  updateOwnBio,
  getImageDownloadURI,
  signOut,
} from 'utils';
import ProgressBar from 'react-native-progress/Bar';
import {ResetPassword} from 'components';

export default function Profile({navigation}) {
  const userData = useSelector((state) => state.firestoreReducer.userData);
  const [bio, setBio] = useState(userData.Bio);
  const UID = useSelector((state) => state.authenticationReducer.userState.uid);
  const currentAuthenticatedUser = useSelector(
    (state) => state.authenticationReducer.userState,
  );
  const [profileURL, setProfileURL] = useState();
  const [edit, setEdit] = useState(false);
  const [imageConfirmPopup, setImageConfirmPopup] = useState(false);
  const [localFilePath, setLocalFilePath] = useState();
  const [options, setOptions] = useState({
    title: 'Select Profile Pic',
    storageOptions: {
      skipBackup: true,
      path: 'images',
    },
    noData: true,
  });
  const [uploadImg, setUploadImg] = useState();
  const [uploadProgress, setuploadProgress] = useState(0);

  const getFileLocalPath = (response) => {
    const {path, uri} = response;
    return Platform.OS === 'android' ? path : uri;
  };

  useEffect(() => {
    getImageDownloadURI(UID).then((url) => {
      setProfileURL(url);
    });
  }, []);
  // Could be imported as a component
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
          yesAction={() => {
            const task = uploadFile(localFilePath, UID);
            monitorFileUpload(task, setuploadProgress);
          }}></ImageConfirmPopup>
        <ConfirmButton
          testID="signOutButton"
          onPress={() => {
            signOut();
          }}
          title="signout"></ConfirmButton>
        <Image
          title="Profle Pic"
          testID="profilePic"
          style={{height: '10%', width: '10%'}}
          source={{
            uri: profileURL,
          }}></Image>

        {edit ? (
          <TextInput
            testID="editBio"
            onChangeText={(updatedBio) => {
              setBio(updatedBio);
            }}
            autoFocus={true}
            defaultValue={userData.Bio}></TextInput>
        ) : (
          <Text testID="bio">Bio: {bio}</Text>
        )}

        <TouchableOpacity
          testID="editBioButton"
          onPress={() => {
            setEdit((edit) => !edit);
          }}
          style={{height: '15%', width: '15%'}}>
          <Image
            style={{height: '75%', width: '75%'}}
            source={Edit_Icon}></Image>
        </TouchableOpacity>

        <ConfirmButton
          testID="confirmBioUpdate"
          onPress={() => {
            setEdit(false);
            updateOwnBio(bio, UID);
          }}
          title="Done"></ConfirmButton>
        <Text testID="firestoreName">Name: {userData.Name} </Text>

        <ConfirmButton
          testID="uploadNewProfilePic"
          title="Upload image"
          onPress={() => {
            imagePicker();
          }}
        />
        <ProgressBar progress={uploadProgress} width={200} />

        <ResetPassword
          authenticatedUser={currentAuthenticatedUser}></ResetPassword>
      </View>
    </SafeAreaView>
  );
}
