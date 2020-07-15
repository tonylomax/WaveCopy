import React, {useEffect, useState, useMemo} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
  FlatList,
  TouchableHighlight,
  ScrollView,
} from 'react-native';
import {
  ConfirmButton,
  ImageConfirmPopup,
  TrainingAccordionMenu,
  SessionListAccordionMenu,
} from 'components';
import {useSelector, useDispatch} from 'react-redux';
import {TextInput} from 'react-native-gesture-handler';
import {Edit_Icon, BrightonBeach} from 'assets';
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
import Moment from 'react-moment';
import moment from 'moment';
import 'moment/src/locale/en-gb';
moment.locale('en-gb');
moment().format('en-gb');

export default function Profile({navigation, route}) {
  //REDUX STATE
  const userData = useSelector((state) => state.firestoreReducer.userData);
  const UID = useSelector((state) => state.authenticationReducer.userState.uid);
  const currentAuthenticatedUser = useSelector(
    (state) => state.authenticationReducer.userState,
  );

  const sessions = useSelector((state) => state.firestoreReducer.sessionData);
  // Finds all sessions that you are signed up for
  const mySessions = useSelector((state) =>
    state.firestoreReducer.roleSpecificSessionData.filter((session) =>
      session?.Mentors.some((mentor) => mentor.id === UID),
    ),
  );

  const beaches = useSelector((state) => state.firestoreReducer.beaches);
  //REDUX STATE

  //LOCAL STATE
  const [bio, setBio] = useState(userData?.Bio);
  const [profileURL, setProfileURL] = useState();
  const [editBio, setEditBio] = useState(false);
  const [imageConfirmPopup, setImageConfirmPopup] = useState(false);
  const [localFilePath, setLocalFilePath] = useState();
  const [
    newProfilePicUploadComplete,
    setNewProfilePicUploadComplete,
  ] = useState(false);
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
  //LOCAL STATE

  const getFileLocalPath = (response) => {
    const {path, uri} = response;
    return Platform.OS === 'android' ? path : uri;
  };

  useEffect(() => {
    console.log('USER DATA IN PROFILE', userData);
  }, [userData]);

  useEffect(() => {
    console.log('SESSIONS IN PROFILE', sessions);
  }, [sessions]);

  useEffect(() => {
    getImageDownloadURI(UID).then((url) => {
      setProfileURL(url);
    });
  }, [newProfilePicUploadComplete]);
  const getBeach = (beachID) => beaches.filter((beach) => (beach.id = beachID));

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
    <SafeAreaView style={{flex: 1}}>
      <ScrollView>
        <Image
          style={{alignSelf: 'center', height: 100}}
          source={BrightonBeach}
        />

        <ImageConfirmPopup
          visible={imageConfirmPopup}
          setVisible={setImageConfirmPopup}
          imgSource={uploadImg?.uri}
          yesAction={() => {
            const task = uploadFile(localFilePath, UID);
            monitorFileUpload(
              task,
              setuploadProgress,
              newProfilePicUploadComplete,
              setNewProfilePicUploadComplete,
            );
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

        <TrainingAccordionMenu training={userData?.Training} />

        <SessionListAccordionMenu
          sessions={
            userData?.Roles?.includes('NationalAdmin') ? sessions : mySessions
          }
          beaches={beaches}
          route={route}
          navigation={navigation}></SessionListAccordionMenu>

        {editBio ? (
          <TextInput
            testID="editBio"
            onChangeText={(updatedBio) => {
              setBio(updatedBio);
            }}
            autoFocus={true}
            defaultValue={userData?.Bio}></TextInput>
        ) : (
          <Text testID="bio">Bio: {bio}</Text>
        )}

        <TouchableOpacity
          testID="editBioButton"
          onPress={() => {
            setEditBio((editBio) => !editBio);
          }}
          style={{height: '15%', width: '15%'}}>
          <Image
            style={{height: '75%', width: '75%'}}
            source={Edit_Icon}></Image>
        </TouchableOpacity>

        <View style={{paddingBottom: 30}}>
          <ConfirmButton
            testID="confirmBioUpdate"
            onPress={() => {
              setEditBio(false);
              updateOwnBio(bio, UID);
            }}
            title="Confirm Bio Update"></ConfirmButton>
          <Text testID="firestoreName">Name: {userData?.firstName} </Text>

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
      </ScrollView>
    </SafeAreaView>
  );
}
