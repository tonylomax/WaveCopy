import React, {useEffect, useState, useMemo} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import {
  ConfirmButton,
  ImageConfirmPopup,
  TrainingAccordionMenu,
  SessionListAccordionMenu,
} from 'components';
import {useSelector, useDispatch} from 'react-redux';
import {Edit_Icon, BrightonBeach} from 'assets';
import ImagePicker from 'react-native-image-picker';
import {
  uploadFile,
  monitorFileUpload,
  updateOwnBio,
  getImageDownloadURI,
  signOut,
  updateOwnContactNumber,
} from 'utils';
import {Avatar, Title, TextInput, Paragraph} from 'react-native-paper';

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
  const [contactNumber, setContactNumber] = useState(userData?.ContactNumber);
  const [profileURL, setProfileURL] = useState();
  const [editBio, setEditBio] = useState(false);
  const [editContactNumber, setEditContactNumber] = useState(false);
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
      <ScrollView testID="profile-scroll-view">
        <View style={{flex: 1}}>
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
            }}
          />

          <ConfirmButton
            testID="signOutButton"
            onPress={() => {
              signOut();
            }}
            title="signout"
          />
          <Title testID="firestoreName">{userData?.firstName} </Title>
          <Avatar.Image
            // title="Profle Pic"
            testID="profilePic"
            size={100}
            // style={{height: '10%', width: '10%'}}
            source={{
              uri: profileURL,
            }}
          />

          <TrainingAccordionMenu training={userData?.Training} />

          <SessionListAccordionMenu
            sessions={
              userData?.Roles?.includes('NationalAdmin') ? sessions : mySessions
            }
            beaches={beaches}
            route={route}
            navigation={navigation}
          />

          {editBio ? (
            <TextInput
              testID="editBio"
              onChangeText={(updatedBio) => {
                setBio(updatedBio);
              }}
              autoFocus={true}
              defaultValue={userData?.Bio}
            />
          ) : (
            <Paragraph testID="bio">Bio: {bio}</Paragraph>
          )}

          <TouchableOpacity
            testID="editBioButton"
            onPress={() => {
              console.log('EDIT BIO PRESSED');
              setEditBio((editBio) => !editBio);
            }}
            style={{height: '15%', width: '15%'}}>
            <Image style={{height: '25%', width: '25%'}} source={Edit_Icon} />
          </TouchableOpacity>

          <ConfirmButton
            testID="confirmBioUpdate"
            onPress={() => {
              setEditBio(false);
              updateOwnBio(bio, UID);
            }}
            title="Confirm Bio Update"
          />

          <ConfirmButton
            testID="uploadNewProfilePic"
            title="Upload image"
            onPress={() => {
              imagePicker();
            }}
            style={{height: '15%', width: '15%'}}
          />
          <Image
            style={{height: '10%', width: '10%'}}
            source={Edit_Icon}></Image>

          <TouchableOpacity
            onPress={() => {
              setEditContactNumber((editContactNumber) => !editContactNumber);
            }}>
            {editContactNumber ? (
              <TextInput
                onChangeText={(updatedNumber) => {
                  setContactNumber(updatedNumber);
                }}
                autoFocus={true}
                defaultValue={contactNumber}></TextInput>
            ) : (
              <Text>{contactNumber}</Text>
            )}
          </TouchableOpacity>

          <ConfirmButton
            title="Update contact number"
            onPress={() => {
              setEditContactNumber(false);
              updateOwnContactNumber(contactNumber, UID);
            }}
          />

          <ProgressBar progress={uploadProgress} width={200} />

          <ResetPassword authenticatedUser={currentAuthenticatedUser} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
