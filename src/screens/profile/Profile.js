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
  CloseButton,
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
import {
  updateRoleSpecificSessions,
  updateSessions,
  updateFirestoreUserData,
} from '../../redux/';

export default function Profile({navigation, route}) {
  const dispatch = useDispatch();
  //REDUX STATE
  const userData = useSelector((state) => state.firestoreReducer.userData);
  const uid = useSelector((state) => state.authenticationReducer.userState.uid);
  const currentAuthenticatedUser = useSelector(
    (state) => state.authenticationReducer.userState,
  );

  const sessions = useSelector((state) => state.firestoreReducer.sessionData);

  const pastSessions = useSelector((state) =>
    state.firestoreReducer.sessionData.filter(
      (session) => session.dateTime < moment(new Date()).format(),
    ),
  );

  const upcomingSessions = useSelector((state) =>
    state.firestoreReducer.sessionData.filter(
      (session) => session.dateTime >= moment(new Date()).format(),
    ),
  );

  // Finds all sessions that you are signed up for
  const mySessions = useSelector((state) =>
    state.firestoreReducer.roleSpecificSessionData.filter((session) =>
      session?.mentors.some((mentor) => mentor.id === uid),
    ),
  );

  const myPastSessions = useSelector((state) =>
    state.firestoreReducer.roleSpecificSessionData
      .filter((session) => session.dateTime < moment(new Date()).format())
      .filter((session) =>
        session?.mentors.some((mentor) => mentor.id === uid),
      ),
  );

  const myUpcomingSessions = useSelector((state) =>
    state.firestoreReducer.roleSpecificSessionData
      .filter((session) => session.dateTime >= moment(new Date()).format())
      .filter((session) =>
        session?.mentors.some((mentor) => mentor.id === uid),
      ),
  );

  const beaches = useSelector((state) => state.firestoreReducer.beaches);
  //REDUX STATE

  //LOCAL STATE
  const [bio, setBio] = useState(userData?.bio);
  const [contactNumber, setContactNumber] = useState(userData?.contactNumber);
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
    getImageDownloadURI(uid).then((url) => {
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
                      const task = uploadFile(localFilePath, uid);
                      monitorFileUpload(
                        task,
                        setuploadProgress,
                        newProfilePicUploadComplete,
                        setNewProfilePicUploadComplete,
                      ).then(() => setImageConfirmPopup(false));
                    }}></ConfirmButton>
                  <CloseButton
                    title="No"
                    onPress={() => {
                      setImageConfirmPopup(false);
                    }}></CloseButton>
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
                  defaultValue={userData?.bio}
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
                    updateOwnBio(bio, uid);
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
                    updateOwnContactNumber(contactNumber, uid);
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
              <TrainingAccordionMenu training={userData?.training} />

              <SessionListAccordionMenu
                sessions={
                  userData?.roles?.includes('NationalAdmin')
                    ? upcomingSessions
                    : myUpcomingSessions
                }
                route={route}
                navigation={navigation}
                title={'Upcoming Sessions'}
              />

              <SessionListAccordionMenu
                sessions={
                  userData?.roles?.includes('NationalAdmin')
                    ? pastSessions
                    : myPastSessions
                }
                route={route}
                navigation={navigation}
                title={'Past Sessions'}
              />
            </Card.Content>
          </Card>

          <CloseButton
            testID="signOutButton"
            onPress={() => {
              signOut().then(() => {
                dispatch(updateRoleSpecificSessions([]));
                dispatch(updateSessions([]));
                dispatch(updateFirestoreUserData({}));
              });
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
