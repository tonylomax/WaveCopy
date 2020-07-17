import React, {useEffect, useState, useMemo} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
  ScrollView,
  ImageBackground,
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
import {
  Avatar,
  Title,
  TextInput,
  Paragraph,
  Portal,
  Modal,
  Card,
  ProgressBar,
} from 'react-native-paper';

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
  const [showProgressBar, setshowProgressBar] = useState(false);
  const [changePasswordModalVisible, setChangePasswordModalVisible] = useState(
    false,
  );

  //LOCAL STATE
  const togglePasswordChangeModal = () =>
    setChangePasswordModalVisible(
      (changePasswordModalVisible) => !changePasswordModalVisible,
    );

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
        <View style={{flex: 1, paddingBottom: 10}}>
          <ImageBackground
            style={{height: 175, width: '100%'}}
            source={BrightonBeach}
          />

          <Portal>
            <Modal
              visible={imageConfirmPopup}
              onDismiss={() => setImageConfirmPopup(false)}>
              <Card
                style={{
                  maxHeight: '75%',
                  alignItems: 'center',
                }}>
                <Card.Title
                  style={{alignSelf: 'center', margin: 0}}
                  title="Are you happy with this new profile picture?"
                />
                <Card.Content>
                  <Image
                    style={{
                      alignSelf: 'center',
                      height: '50%',
                      width: '50%',
                    }}
                    source={{uri: uploadImg?.uri}}></Image>
                  <ConfirmButton
                    title="Yes"
                    onPress={() => {
                      setshowProgressBar(true);
                      const task = uploadFile(localFilePath, UID);
                      monitorFileUpload(
                        task,
                        setuploadProgress,
                        newProfilePicUploadComplete,
                        setNewProfilePicUploadComplete,
                      ).then(() => setImageConfirmPopup(false));
                    }}></ConfirmButton>
                  <ConfirmButton
                    title="No"
                    onPress={() => {
                      setImageConfirmPopup(false);
                    }}></ConfirmButton>
                  <ProgressBar
                    visible={showProgressBar}
                    progress={uploadProgress}
                  />
                </Card.Content>
              </Card>
            </Modal>
          </Portal>

          <Card style={{margin: '2%', maxHeight: 200}}>
            <Card.Content>
              <Title style={{alignSelf: 'center'}} testID="firestoreName">
                {userData?.firstName}{' '}
              </Title>
              <Avatar.Image
                style={{alignSelf: 'center'}}
                // title="Profle Pic"
                testID="profilePic"
                size={100}
                source={{
                  uri: profileURL,
                }}
              />
              <TouchableOpacity
                testID="changeProfilePic"
                onPress={() => {
                  console.log('CHANGE PROFILE PIC PRESSED');
                  imagePicker();
                }}
                style={{height: '12%', width: '12%', alignSelf: 'flex-end'}}>
                <Image
                  style={{height: '100%', width: '100%', overflow: 'visible'}}
                  source={Edit_Icon}
                />
              </TouchableOpacity>
            </Card.Content>
          </Card>

          {/* BIO CARD */}
          <Card style={{margin: '2%', maxHeight: 400}}>
            <Card.Content style={{padding: 10}}>
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
                  if (editBio) {
                    updateOwnBio(bio, UID);
                  }
                }}
                style={{
                  minHeight: '15%',
                  minWidth: '15%',
                  height: '15%',
                  width: '15%',
                  alignSelf: 'flex-end',
                }}>
                <Image
                  style={{height: '100%', width: '100%', overflow: 'visible'}}
                  source={Edit_Icon}
                />
              </TouchableOpacity>
            </Card.Content>
            <Card.Content style={{padding: 10}}>
              {editContactNumber ? (
                <TextInput
                  testID="editContactNumber"
                  onChangeText={(updatedNumber) => {
                    setContactNumber(updatedNumber);
                  }}
                  autoFocus={true}
                  defaultValue={contactNumber}
                />
              ) : (
                <Paragraph testID="bio">
                  Contact Number: {contactNumber}
                </Paragraph>
              )}
              <TouchableOpacity
                testID="editContactNumber"
                onPress={() => {
                  setEditContactNumber(
                    (editContactNumber) => !editContactNumber,
                  );
                  if (editContactNumber) {
                    updateOwnContactNumber(contactNumber, UID);
                  }
                }}
                style={{
                  height: '15%',
                  width: '15%',
                  alignSelf: 'flex-end',
                  minHeight: '15%',
                  minWidth: '15%',
                }}>
                <Image
                  style={{height: '100%', width: '100%', overflow: 'visible'}}
                  source={Edit_Icon}
                />
              </TouchableOpacity>
            </Card.Content>
          </Card>

          <Card style={{margin: '2%'}}>
            <Card.Content>
              <TrainingAccordionMenu training={userData?.Training} />

              <SessionListAccordionMenu
                sessions={
                  userData?.Roles?.includes('NationalAdmin')
                    ? sessions
                    : mySessions
                }
                beaches={beaches}
                route={route}
                navigation={navigation}
              />
            </Card.Content>
          </Card>

          <ConfirmButton
            testID="signOutButton"
            onPress={() => {
              signOut();
            }}
            title="Signout"
          />

          <ConfirmButton
            title="Change Password"
            onPress={() => {
              togglePasswordChangeModal();
            }}></ConfirmButton>

          <Portal>
            <Modal
              visible={changePasswordModalVisible}
              onDismiss={togglePasswordChangeModal}>
              <Card>
                <Card.Title title="Change Password" />

                <Card.Content>
                  <ResetPassword authenticatedUser={currentAuthenticatedUser} />
                </Card.Content>
              </Card>
            </Modal>
          </Portal>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
